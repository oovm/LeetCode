#!/usr/bin/env python3
"""回填 metadata.json 中的 "Execution timed out" 占位符。

按题内 Python 参考解真实计算 expected：

- 单用例在独立子进程内执行（超时即 kill，不污染主进程，不泄漏状态）。
- 整数值越过 Number.MAX_SAFE_INTEGER 时序列化为十进制字符串（语料精度合同）。
- 输出 JSON 字节超过 --max-output-bytes 时判定为不可行用例，保留占位符并结构化记录。
- --check 模式：重算全部非占位用例并与现存 expected 比对（只报告，不写回）。

用法：
    python backfill_timed_out.py <problem-dir> [--apply] [--check]
        [--case-timeout SECONDS] [--max-output-bytes N] [--cases 0,3,5]
"""
from __future__ import annotations

import argparse
import json
import multiprocessing as mp
import sys
import time
from pathlib import Path
from typing import Any

sys.set_int_max_str_digits(200000)

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

import run_python_solver as rps  # noqa: E402

PLACEHOLDER = "Execution timed out"
MAX_SAFE = 9007199254740991


def to_jsonable(value: Any) -> Any:
    """精度安全序列化：超安全整数转十进制字符串；tuple 归一为 list。"""
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return str(value) if abs(value) > MAX_SAFE else value
    if isinstance(value, float):
        return value
    if isinstance(value, str):
        return value
    if isinstance(value, (list, tuple)):
        return [to_jsonable(item) for item in value]
    if isinstance(value, dict):
        return {str(key): to_jsonable(item) for key, item in value.items()}
    return value


def dumps_compact(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(", ", ": "))


def _worker(payload: tuple[str, int, dict[str, Any], list[str]]) -> dict[str, Any]:
    """子进程：加载题解并执行单条用例，返回精度安全结果。"""
    problem_dir, index, args, int_keys = payload
    candidate, _tests, _mode = rps.load_solver_context(Path(problem_dir))
    coerced = {
        key: rps._coerce_int_args(value) if key in int_keys else value for key, value in args.items()
    }
    actual = candidate(**coerced)
    return {"index": index, "result": to_jsonable(actual)}


def run_case(
    pool_state: dict[str, Any],
    problem_dir: str,
    index: int,
    args: dict[str, Any],
    int_keys: list[str],
    case_timeout: float,
) -> tuple[dict[str, Any] | None, float, bool]:
    """串行执行单条用例；超时 kill worker 并重建 pool。返回 (结果, 耗时, 是否超时)。"""
    pool: mp.pool.Pool = pool_state["pool"]
    start = time.perf_counter()
    async_result = pool.apply_async(_worker, ((problem_dir, index, args, int_keys),))
    try:
        payload = async_result.get(timeout=case_timeout)
        return payload, time.perf_counter() - start, False
    except mp.TimeoutError:
        pool.terminate()
        pool.join()
        pool_state["pool"] = mp.Pool(processes=1, maxtasksperchild=1)
        return None, time.perf_counter() - start, True
    except Exception:
        pool.terminate()
        pool.join()
        pool_state["pool"] = mp.Pool(processes=1, maxtasksperchild=1)
        raise


def placeholder_indices(tests: list[dict[str, Any]]) -> list[int]:
    return [i for i, case in enumerate(tests) if case.get("expected") == PLACEHOLDER]


def apply_results(meta_path: Path, results: dict[int, Any], placeholder_order: list[int]) -> None:
    """按占位符出现次序定点替换已解出的用例，未解出的保留占位符，其余字节不动。"""
    text = meta_path.read_text(encoding="utf-8")
    needle = '"expected": "Execution timed out"'
    parts = text.split(needle)
    if len(parts) - 1 != len(placeholder_order):
        raise ValueError(f"placeholder count {len(parts) - 1} != tests order {len(placeholder_order)}")
    rebuilt = parts[0]
    for position, case_index in enumerate(placeholder_order):
        value = results.get(case_index)
        if value is None:
            rebuilt += needle
        else:
            rebuilt += '"expected": ' + dumps_compact(value)
        rebuilt += parts[position + 1]
    meta_path.write_text(rebuilt, encoding="utf-8", newline="\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("problem_dir")
    parser.add_argument("--apply", action="store_true", help="写回 metadata.json")
    parser.add_argument("--check", action="store_true", help="重算全部非占位用例并比对")
    parser.add_argument("--case-timeout", type=float, default=60.0)
    parser.add_argument("--max-output-bytes", type=int, default=2_000_000)
    parser.add_argument("--cases", type=str, default="", help="仅处理指定 tests 下标，逗号分隔")
    args = parser.parse_args()

    problem_dir = Path(args.problem_dir)
    meta = rps.load_metadata(problem_dir)
    tests = meta["tests"]
    int_keys = sorted(rps._infer_int_keys(tests))
    selected = {int(token) for token in args.cases.split(",") if token.strip()} if args.cases else None

    if args.check:
        targets = [
            i for i, case in enumerate(tests) if case.get("expected") != PLACEHOLDER and "corpusDefect" not in case
        ]
    else:
        targets = placeholder_indices(tests)
    if selected is not None:
        targets = [i for i in targets if i in selected]

    pool_state: dict[str, Any] = {"pool": mp.Pool(processes=1, maxtasksperchild=1)}
    results: dict[int, Any] = {}
    counts = {"backfilled": 0, "timeout": 0, "oversized": 0, "match": 0, "mismatch": 0, "float": 0}
    try:
        for index in targets:
            case = tests[index]
            try:
                payload, elapsed, timed_out = run_case(
                    pool_state, str(problem_dir), index, case["args"], int_keys, args.case_timeout
                )
            except Exception as exc:  # noqa: BLE001
                print(f"ERROR idx={index} {type(exc).__name__}: {exc}")
                continue
            if timed_out:
                counts["timeout"] += 1
                print(f"TIMEOUT idx={index} after={elapsed:.1f}s args={dumps_compact(case['args'])[:160]}")
                continue
            assert payload is not None
            result = payload["result"]
            encoded = dumps_compact(result)
            if args.check:
                if result == case["expected"]:
                    counts["match"] += 1
                else:
                    counts["mismatch"] += 1
                    print(
                        f"MISMATCH idx={index} stored={dumps_compact(case['expected'])[:120]} "
                        f"actual={encoded[:120]}"
                    )
                continue
            if contains_float(result):
                counts["float"] += 1
                print(f"FLOAT idx={index} args={dumps_compact(case['args'])[:120]}")
                continue
            if len(encoded.encode("utf-8")) > args.max_output_bytes:
                counts["oversized"] += 1
                print(
                    f"OVERSIZED idx={index} bytes={len(encoded.encode('utf-8'))} "
                    f"args={dumps_compact(case['args'])[:120]}"
                )
                continue
            results[index] = result
            counts["backfilled"] += 1
            print(f"BACKFILLED idx={index} bytes={len(encoded.encode('utf-8'))} ms={int(elapsed * 1000)}")
    finally:
        pool_state["pool"].terminate()
        pool_state["pool"].join()

    if args.apply and results:
        meta_path = problem_dir / "metadata.json"
        apply_results(meta_path, results, placeholder_indices(tests))
        print(f"APPLIED {len(results)} placeholders -> {meta_path}")
    print("SUMMARY " + " ".join(f"{key}={value}" for key, value in counts.items()))
    return 0


def contains_float(value: Any) -> bool:
    if isinstance(value, float):
        return True
    if isinstance(value, list):
        return any(contains_float(item) for item in value)
    if isinstance(value, dict):
        return any(contains_float(item) for item in value.values())
    return False


if __name__ == "__main__":
    raise SystemExit(main())
