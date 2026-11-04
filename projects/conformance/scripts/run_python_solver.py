#!/usr/bin/env python3
"""加载 solvers/python/solution.py 并执行 metadata.tests。"""
from __future__ import annotations

import copy
import json
import re
import sys
import time
from pathlib import Path
from typing import Any, Callable

from python_design_sequence import invoke_case, is_operation_sequence_args, operation_step_path

# 十进制字符串还原走原生 int（任意精度）：放开默认 4300 位上限，
# 覆盖大整数答案（如 4500 位数字串）的精确解析。
sys.set_int_max_str_digits(200000)

# 生成器侧只把越过 Number.MAX_SAFE_INTEGER 的整数写成十进制字符串；
# 「超安全整数的字符串整数」即被转换的那类数值，按十进制还原为 int（任意精度，无损失）。
# 形如 "11101110111" 的真实字符串参数（值未超安全整数）原样保留。
_MAX_SAFE = 9007199254740991
_INT_LITERAL = re.compile(r"^-?\d+$")


def _is_unsafe_int_string(value: Any) -> bool:
    return isinstance(value, str) and bool(_INT_LITERAL.match(value)) and abs(int(value)) > _MAX_SAFE


def _coerce_int_args(value: Any) -> Any:
    if _is_unsafe_int_string(value):
        return int(value)
    if isinstance(value, list):
        return [_coerce_int_args(item) for item in value]
    return value


def _has_bare_number(value: Any) -> bool:
    # bool 是 int 子类，布尔实参不算裸数值。
    if isinstance(value, bool):
        return False
    if isinstance(value, (int, float)):
        return True
    if isinstance(value, list):
        return any(_has_bare_number(item) for item in value)
    return False


def _infer_int_keys(tests: list[dict[str, Any]]) -> set[str]:
    # 生成器约定：整数型实参在不超安全整数时写裸数值；字符串型实参始终为字符串。
    # 任一同键出现裸数值即判定整数型；仅对整数型键规整超安全整数字符串，
    # 字符串型键（如二进制串）一律原样保留。
    keys: set[str] = set()
    for case in tests:
        args = case.get("args")
        if not isinstance(args, dict):
            continue
        for key, value in args.items():
            if _has_bare_number(value):
                keys.add(key)
    return keys


def _compare(actual: Any, expected: Any) -> bool:
    # expected 为超安全整数字符串、actual 为 int（非 bool）时按十进制还原比较。
    if _is_unsafe_int_string(expected) and isinstance(actual, int) and not isinstance(actual, bool):
        return actual == int(expected)
    if isinstance(expected, list) and isinstance(actual, list):
        return len(actual) == len(expected) and all(_compare(a, e) for a, e in zip(actual, expected))
    return actual == expected


def slug_to_python_project(slug: str) -> str:
    name = slug.replace("-", "_")
    if re.match(r"^[0-9]", name):
        name = f"lc_{name}"
    return name


def load_metadata(problem_dir: Path) -> dict[str, Any]:
    meta_path = problem_dir / "metadata.json"
    if not meta_path.is_file():
        raise FileNotFoundError(f"missing metadata: {meta_path}")
    return json.loads(meta_path.read_text(encoding="utf-8"))


def _read_pair(prelude_path: Path, solution_path: Path) -> str | None:
    if prelude_path.is_file() and solution_path.is_file():
        prelude = prelude_path.read_text(encoding="utf-8").rstrip()
        solution = solution_path.read_text(encoding="utf-8").lstrip()
        if prelude:
            return f"{prelude}\n\n{solution}\n"
        return f"{solution}\n"
    if solution_path.is_file():
        return solution_path.read_text(encoding="utf-8")
    return None


def load_python_source(problem_dir: Path, slug: str) -> str:
    canonical = problem_dir / "solvers" / "python" / "solution.py"
    if canonical.is_file():
        return canonical.read_text(encoding="utf-8")

    project_name = slug_to_python_project(slug)
    legacy_roots = [
        problem_dir / "solvers" / "python" / project_name,
        problem_dir / "solvers" / "python" / "reference",
        problem_dir / "solvers" / "python" / "lcd",
        problem_dir / "solvers" / "python",
    ]
    for root in legacy_roots:
        merged = _read_pair(root / "prelude.py", root / "solution.py")
        if merged is not None:
            return merged
        nested = root / project_name
        merged = _read_pair(nested / "prelude.py", nested / "solution.py")
        if merged is not None:
            return merged

    raise FileNotFoundError(f"missing solvers/python/solution.py (or legacy layout) under {problem_dir}")


def resolve_candidate(entry_point: str, namespace: dict[str, Any]) -> Callable[..., Any]:
    expr = entry_point.strip()
    if "(" in expr:
        return eval(expr, namespace)  # noqa: S307
    return namespace[expr]


def _assert_operation_sequence(index: int, operations: list[str], expected: Any, actual: Any) -> None:
    path = operation_step_path(index, 0, operations[0])
    if not isinstance(expected, list) or len(expected) != len(operations):
        raise ValueError(f"{path}: expected 必须与 operations 等长（{len(operations)}）")
    if not isinstance(actual, list):
        raise AssertionError(f"{path}: 解法未返回操作序列结果（收到 {type(actual).__name__}）")
    if len(actual) != len(expected):
        raise AssertionError(f"{path}: 期望 {len(expected)} 个返回值，实际 {len(actual)} 个")
    for step, operation in enumerate(operations):
        if not _compare(actual[step], expected[step]):
            raise AssertionError(
                f"{operation_step_path(index, step, operation)}: expected {expected[step]!r}, got {actual[step]!r}",
            )


def run_check(candidate: Callable[..., Any], tests: list[dict[str, Any]]) -> None:
    int_keys = _infer_int_keys(tests)
    for index, case in enumerate(tests):
        args = case.get("args")
        if not isinstance(args, dict):
            raise ValueError(f"tests[{index}].args 必须是 object")
        expected = case["expected"]
        # 题解可能原地修改实参；每轮执行都从原始用例的深拷贝开始，避免 bench 重复轮污染。
        args = copy.deepcopy(args)
        coerced_args = {
            key: _coerce_int_args(value) if key in int_keys else value for key, value in args.items()
        }
        try:
            actual = invoke_case(candidate, coerced_args)
        except Exception as exc:  # noqa: BLE001
            if isinstance(expected, str) and expected.startswith("Error:"):
                actual_err = f"Error: {exc}"
                if actual_err == expected:
                    continue
                raise AssertionError(
                    f"tests[{index}]: expected {expected!r}, got {actual_err!r}, args={args!r}",
                ) from exc
            if is_operation_sequence_args(coerced_args):
                raise AssertionError(f"tests[{index}]: 解法抛错 {exc}") from exc
            raise
        if isinstance(expected, str) and expected.startswith("Error:"):
            raise AssertionError(
                f"tests[{index}]: expected {expected!r}, no exception raised, args={args!r}",
            )
        if is_operation_sequence_args(coerced_args):
            _assert_operation_sequence(index, coerced_args["operations"], expected, actual)
        elif not _compare(actual, expected):
            raise AssertionError(f"tests[{index}]: expected {expected!r}, got {actual!r}, args={args!r}")


def load_solver_context(problem_dir: Path) -> tuple[Callable[..., Any], list[dict[str, Any]]]:
    python_dir = problem_dir / "solvers" / "python"
    if not (python_dir / "pyproject.toml").is_file():
        raise FileNotFoundError(f"missing solvers/python/pyproject.toml under {problem_dir}")

    meta = load_metadata(problem_dir)
    slug = meta.get("id") or meta.get("task_id")
    if not slug:
        raise ValueError("metadata.id 缺失")

    tests = meta.get("tests")
    if not tests:
        raise ValueError("metadata.tests 为空")

    invoke = meta.get("invoke") or {}
    entry_point = invoke.get("python")
    if not entry_point:
        raise ValueError("metadata.invoke.python 缺失")

    source = load_python_source(problem_dir, slug)
    namespace: dict[str, Any] = {"__name__": "__main__"}
    exec(source, namespace)  # noqa: S102
    candidate = resolve_candidate(entry_point, namespace)
    return candidate, tests


def run_solver(problem_dir: Path) -> None:
    candidate, tests = load_solver_context(problem_dir)
    run_check(candidate, tests)


def median_ms(values: list[float]) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    mid = len(ordered) // 2
    if len(ordered) % 2 == 0:
        return (ordered[mid - 1] + ordered[mid]) / 2.0
    return ordered[mid]


def bench_solver(problem_dir: Path, iterations: int, warmup: int) -> float:
    """单 Python 进程内加载题解后只计 metadata.tests 循环（对齐 TS in-process）。"""
    candidate, tests = load_solver_context(problem_dir)

    def run_all() -> None:
        run_check(candidate, tests)

    for _ in range(warmup):
        run_all()

    samples: list[float] = []
    for _ in range(iterations):
        start = time.perf_counter()
        run_all()
        samples.append((time.perf_counter() - start) * 1000.0)
    return median_ms(samples)


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: run_python_solver.py <problem-dir> [--bench [--iterations N] [--warmup N]]", file=sys.stderr)
        return 2

    problem_dir = Path(sys.argv[1])
    if not problem_dir.is_dir():
        print(f"missing problem dir: {problem_dir}", file=sys.stderr)
        return 2

    bench_mode = "--bench" in sys.argv[2:]
    iterations = 50
    warmup = 5
    if bench_mode:
        for index, token in enumerate(sys.argv[2:], start=2):
            if token == "--iterations" and index + 1 < len(sys.argv):
                iterations = int(sys.argv[index + 1])
            elif token == "--warmup" and index + 1 < len(sys.argv):
                warmup = int(sys.argv[index + 1])

    try:
        if bench_mode:
            median = bench_solver(problem_dir, iterations, warmup)
            print(json.dumps({"medianMs": median}))
        else:
            run_solver(problem_dir)
    except Exception as exc:  # noqa: BLE001
        print(f"FAILED {problem_dir}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
