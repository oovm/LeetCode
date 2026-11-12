/** 单调用用例：`args` 即一次调用的全部实参。 */
export type CallTestCase = {
    args: Record<string, unknown>;
    expected: unknown;
};

/**
 * 设计类题目的操作序列实参原形（与 `<slug>.cases.ts` 用例已有字段一一对应）：
 * `operations[0]` 是类名（构造），其后是方法名；`arguments` 与 `operations` 等长，
 * `arguments[0]` 是构造参数，其余是各操作的实参。
 */
export type OperationSequenceArgs = {
    operations: string[];
    arguments: unknown[][];
};

/** 操作序列用例：`expected` 与 `operations` 等长，逐步断言返回值（构造步用 `null`）。 */
export type OperationSequenceCase = {
    args: OperationSequenceArgs;
    expected: unknown[];
};

/** 单题测试用例；题目目录 `<slug>.cases.ts` 为判题真源（JSON 判题已全量清退）。 */
export type TestCase = CallTestCase | OperationSequenceCase;

/** 稳定题目标识与元数据；catalog 仅为索引视图。 */
export type ProblemSpec = {
    id: string;
    title: string;
    questionId: number;
    difficulty: string;
    tags: string[];
    tests: TestCase[];
    invoke: Record<string, string | undefined>;
};

/** 某题某一语言实现的入口声明。 */
export type ImplementationSpec = {
    /** 与适配器注册 ID 一致，如 `python`、`typescript-node`。 */
    implementationId: string;
    problemId: string;
    invokeKey: string;
    solverPath: string;
};
