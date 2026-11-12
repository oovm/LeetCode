/**
 * 设计类题目的操作序列模型：一次构造 + 逐操作调用 + 每步断言。
 *
 * 题面原形（`<slug>.cases.ts`）：
 * `args.operations`（`[类名, 方法名, ...]`）、`args.arguments`（与 operations 等长，
 * `arguments[0]` 为构造参数）、`expected`（与 operations 等长，构造步为 `null`）。
 *
 * 这里只定义"如何识别与如何运行/断言"，不把操作序列降维成单函数调用：
 * 类实例的状态在步骤之间必须共享。
 */
import { assertTestCase } from './assert.ts';
import type { OperationSequenceArgs, OperationSequenceCase, TestCase } from './problem.ts';

/** 显式识别操作序列实参：必须恰好是 `operations` + `arguments` 两个键且形状完整。 */
export function isOperationSequenceArgs(args: Record<string, unknown>): args is Record<string, unknown> & OperationSequenceArgs {
    const keys = Object.keys(args);
    if (keys.length !== 2 || !keys.includes('operations') || !keys.includes('arguments')) {
        return false;
    }
    const operations = args.operations;
    const parameters = args.arguments;
    return (
        Array.isArray(operations) &&
        operations.length > 0 &&
        operations.every((operation) => typeof operation === 'string') &&
        Array.isArray(parameters) &&
        parameters.length === operations.length &&
        parameters.every((parameter) => Array.isArray(parameter))
    );
}

/** 用例是否为操作序列形态（`expected` 必须是数组且与 operations 等长）。 */
export function isOperationSequenceCase(test: TestCase | { args: Record<string, unknown>; expected: unknown }): test is OperationSequenceCase {
    if (!isOperationSequenceArgs(test.args)) {
        return false;
    }
    return Array.isArray(test.expected) && test.expected.length === test.args.operations.length;
}

/** 每步断言使用的路径前缀，报错时能指出第几步、哪个操作。 */
export function operationStepPath(testIndex: number, step: number, operation: string): string {
    return `tests[${testIndex}].step[${step}] (${operation})`;
}

type DesignClass = new (...args: unknown[]) => Record<string, unknown>;

/**
 * 构造一次类实例后按 `operations[1..]` 依次调用方法，返回逐步返回值。
 * 构造步在返回值数组第 0 位固定为 `null`（与 `expected[0]` 的占位对齐）。
 * 类名不符或方法缺失按结构化错误抛出，绝不静默跳过。
 */
export function runOperationSequence(classSymbol: string, ctor: DesignClass, sequence: OperationSequenceArgs): unknown[] {
    const [constructorOperation, ...methodOperations] = sequence.operations;
    const [constructorArguments, ...methodArguments] = sequence.arguments;
    if (constructorOperation !== classSymbol) {
        throw new Error(
            `操作序列第 0 步应为构造 "${classSymbol}"，实际为 ${JSON.stringify(constructorOperation)}`,
        );
    }
    const instance = new ctor(...(constructorArguments ?? []));
    const results: unknown[] = [null];
    methodOperations.forEach((operation, offset) => {
        const step = offset + 1;
        const method = instance[operation];
        if (typeof method !== 'function') {
            throw new Error(`操作序列第 ${step} 步 "${operation}"：实例上不存在该方法`);
        }
        try {
            const returned = (method as (...args: unknown[]) => unknown).apply(instance, methodArguments[offset] ?? []);
            // 设计类操作序列里 `void` 操作的占位是 `null`（与 Python `None` 对齐）。
            results.push(returned === undefined ? null : returned);
        } catch (err) {
            throw new Error(`操作序列第 ${step} 步 "${operation}" 抛错：${err instanceof Error ? err.message : String(err)}`);
        }
    });
    return results;
}

/**
 * 逐步断言实际返回值：长度不符、某步值不符或某步抛错都会指明
 * `tests[i].step[j] (op)`，而不是只报用例整体失败。
 */
export function assertOperationSequence(index: number, sequence: OperationSequenceArgs, expected: readonly unknown[], actual: unknown): void {
    const operations = sequence.operations;
    if (!Array.isArray(actual)) {
        throw new Error(`${operationStepPath(index, 0, operations[0] ?? '?')}: 解法未返回操作序列结果（收到 ${typeof actual}）`);
    }
    if (actual.length !== expected.length) {
        throw new Error(
            `${operationStepPath(index, 0, operations[0] ?? '?')}: 操作序列有 ${operations.length} 步，期望 ${expected.length} 个返回值，实际 ${actual.length} 个`,
        );
    }
    for (const [step, operation] of operations.entries()) {
        assertTestCase(step, expected[step], () => actual[step], operationStepPath(index, step, operation));
    }
}

/**
 * 只用于不含脚本参考实现的 lane：操作序列的执行需要类实例句柄，
 * 明确报结构化失败而不是把类当函数调用。
 */
export function operationSequenceUnsupportedReason(lane: string): string {
    return `lane ${lane} 尚无类实例句柄，无法执行设计类操作序列（${'new'}+逐操作调用）`;
}
