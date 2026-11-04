#!/usr/bin/env python3
"""设计类题目操作序列的 Python 侧执行器。

与 TS 侧 `src/domain/operation-sequence.ts` 同语义：
`operations[0]` 为构造、`arguments[0]` 为构造参数，其后逐操作调用；
必须共享同一个实例状态，绝不把操作序列降维成单函数调用。
"""
from __future__ import annotations

from typing import Any, Callable


def is_operation_sequence_args(args: Any) -> bool:
    if not isinstance(args, dict) or set(args.keys()) != {"operations", "arguments"}:
        return False
    operations = args["operations"]
    parameters = args["arguments"]
    if not isinstance(operations, list) or not operations:
        return False
    if not all(isinstance(operation, str) for operation in operations):
        return False
    if not isinstance(parameters, list) or len(parameters) != len(operations):
        return False
    return all(isinstance(parameter, list) for parameter in parameters)


def operation_step_path(index: int, step: int, operation: str) -> str:
    return f"tests[{index}].step[{step}] ({operation})"


def invoke_case(candidate: Callable[..., Any], args: dict[str, Any]) -> Any:
    """单调用直接调用；操作序列先 new 一次再逐操作调用并返回逐步结果。"""
    if not is_operation_sequence_args(args):
        return candidate(**args)
    operations = args["operations"]
    parameters = args["arguments"]
    expected_name = getattr(candidate, "__name__", None)
    if expected_name is not None and operations[0] != expected_name:
        raise RuntimeError(
            f'操作序列第 0 步应为构造 "{expected_name}"，实际为 {operations[0]!r}',
        )
    instance = candidate(*parameters[0])
    results: list[Any] = [None]
    for step, (operation, arguments) in enumerate(zip(operations[1:], parameters[1:]), start=1):
        try:
            method = getattr(instance, operation)
        except AttributeError as exc:
            raise RuntimeError(f'操作序列第 {step} 步 "{operation}"：实例上不存在该方法') from exc
        try:
            results.append(method(*arguments))
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError(f'操作序列第 {step} 步 "{operation}" 抛错：{exc}') from exc
    return results
