#!/usr/bin/env python3
"""Python 解法子进程：与 TS/V 子进程共用同一 NDJSON 协议与计时口径。

判题器（父进程）经 stdin 发 `load`/`run`/`bye`，本子进程经 stdout 回
`ready`/`done`/`error`。`bigint` 以 `{"$bigint": "<十进制>"}` tagged 形态传输，
Python `int` 任意精度天然保真；判题/断言全部在父进程完成，本进程只加载解法。
"""
from __future__ import annotations

import copy
import json
import sys
import time
from pathlib import Path
from typing import Any, Callable

sys.set_int_max_str_digits(200000)

from python_design_sequence import invoke_case  # noqa: E402

_MAX_SAFE = 9007199254740991


def _decode_value(value: Any) -> Any:
    if isinstance(value, dict):
        keys = set(value.keys())
        if keys == {"$bigint"}:
            return int(value["$bigint"])
        if keys == {"$undefined"}:
            return None
        return {key: _decode_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_decode_value(item) for item in value]
    return value


def _encode_value(value: Any) -> Any:
    # bool 是 int 子类，必须先判 bool，否则 True 会被编成 1。
    if isinstance(value, bool) or value is None or isinstance(value, str):
        return value
    if isinstance(value, int):
        if abs(value) > _MAX_SAFE:
            return {"$bigint": str(value)}
        return value
    if isinstance(value, float):
        if value != value or value in (float("inf"), float("-inf")):
            raise ValueError("非有限浮点不允许进入判题协议")
        return value
    if isinstance(value, (list, tuple)):
        return [_encode_value(item) for item in value]
    if isinstance(value, dict):
        return {str(key): _encode_value(item) for key, item in value.items()}
    raise ValueError(f"不支持协议编码的值类型 {type(value).__name__}")


def _resolve_candidate(entry_point: str, namespace: dict[str, Any]) -> Callable[..., Any]:
    expr = entry_point.strip()
    if "(" in expr:
        return eval(expr, namespace)  # noqa: S307
    return namespace[expr]


def _load(message: dict[str, Any]) -> Callable[..., Any]:
    solution = message.get("solution")
    if not solution:
        raise ValueError("load 消息缺少 solution 路径")
    source = Path(solution).read_text(encoding="utf-8")
    namespace: dict[str, Any] = {"__name__": "__main__"}
    exec(source, namespace)  # noqa: S102
    return _resolve_candidate(message["invoke"], namespace)


def _run(candidate: Callable[..., Any], message: dict[str, Any]) -> dict[str, Any]:
    decoded = [
        {"index": entry["index"], "args": _decode_value(entry["args"])}
        for entry in message["cases"]
    ]
    warmup = int(message["warmup"])
    iterations = int(message["iterations"])

    # 题解可能原地修改实参（排序/去重/旋转），每轮与收集都必须用独立深拷贝，
    # 否则计时轮污染收集轮输入，会把正确解法误判成答案错。克隆在计时窗口外完成。
    def fresh_round() -> list[dict[str, Any]]:
        return [copy.deepcopy(entry["args"]) for entry in decoded]

    def loop_all(inputs: list[dict[str, Any]]) -> None:
        for args in inputs:
            invoke_case(candidate, args)

    for _ in range(warmup):
        loop_all(fresh_round())

    samples: list[float] = []
    for _ in range(iterations):
        inputs = fresh_round()
        start = time.perf_counter()
        loop_all(inputs)
        samples.append((time.perf_counter() - start) * 1000.0)

    collect_start = time.perf_counter()
    results: list[dict[str, Any]] = []
    for entry in decoded:
        try:
            value = invoke_case(candidate, copy.deepcopy(entry["args"]))
            results.append({"index": entry["index"], "ok": True, "value": _encode_value(value)})
        except Exception as exc:  # noqa: BLE001
            results.append({"index": entry["index"], "ok": False, "error": str(exc)})
    return {
        "type": "done",
        "results": results,
        "samples": samples,
        "collectMs": (time.perf_counter() - collect_start) * 1000.0,
    }


def _send(message: dict[str, Any]) -> None:
    sys.stdout.write(json.dumps(message, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def main() -> int:
    candidate: Callable[..., Any] | None = None
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            message = json.loads(line)
        except json.JSONDecodeError as exc:
            _send({"type": "error", "stage": "run", "message": f"协议行不是合法 JSON: {exc}"})
            continue
        kind = message.get("type")
        if kind == "load":
            try:
                candidate = _load(message)
                _send({"type": "ready"})
            except Exception as exc:  # noqa: BLE001
                _send({"type": "error", "stage": "load", "message": str(exc)})
        elif kind == "run":
            if candidate is None:
                _send({"type": "error", "stage": "run", "message": "尚未 load 解法"})
                continue
            try:
                _send(_run(candidate, message))
            except Exception as exc:  # noqa: BLE001
                _send({"type": "error", "stage": "run", "message": str(exc)})
        elif kind == "bye":
            return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
