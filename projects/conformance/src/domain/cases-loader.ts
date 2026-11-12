/**
 * 判题用例唯一装载器。
 *
 * 判题真源合同（06 账本裁定）：`<slug>.cases.ts` 是判题用例的唯一来源；
 * `metadata.json#tests` 已全量清退，任何装载路径都不得回退到 JSON 判题。
 *
 * - TS 模块承载 `bigint` 字面量与显式 `corpusDefect` 标注，规避 JSON 的表达力
 *   与序列化损失；缺陷条目不进 pass/fail 分母。
 * - cases 模块是纯数据 + `import type` 的 ESM；lane 装载入口多为同步函数，
 *   这里按源码文本转译（`ts.transpileModule`，ES2020/CJS）后在隔离沙箱中求值，
 *   不依赖调用方是否运行在 tsx 的 require hook 下。
 * - 缺文件/空数组 → `cases_missing` 结构化失败；schema 与数值保真违规 →
 *   `cases_schema` / `unsafe_number`，由 `validateCasesModule` 统一裁决。
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

import ts from 'typescript';

import { partitionCases, validateCasesModule, type ProblemCase, type ProblemCases } from '../isolated/cases.ts';

export type CasesFailureKind = 'cases_missing' | 'cases_schema' | 'unsafe_number';

/** 用例装载的结构化失败：kind 供 lane 侧映射到既有失败分类。 */
export class CasesLoadError extends Error {
    readonly kind: CasesFailureKind;

    constructor(kind: CasesFailureKind, message: string) {
        super(message);
        this.name = 'CasesLoadError';
        this.kind = kind;
    }
}

export type LoadedProblemCases = {
    /** 全量用例（含 `corpusDefect` 标注条目，供审计与坐标对照）。 */
    cases: ProblemCase[];
    /** 可执行用例（判题分母）。 */
    executable: ProblemCase[];
    /** 被 `corpusDefect` 排除、不计入 pass/fail 的条目数。 */
    defectSkipped: number;
    /** 用例真源路径（`<slug>.cases.ts`）。 */
    source: string;
};

/** 从 `metadata.json` 读 slug（目录名 = slug = id 的仓内约定由 `problemIdFromDir` 兜底）。 */
function problemSlugOf(problemRoot: string): string {
    const meta = JSON.parse(readFileSync(join(problemRoot, 'metadata.json'), 'utf8')) as { id?: string };
    const id = meta.id?.trim();
    if (!id) {
        throw new CasesLoadError('cases_missing', `metadata.id 缺失：${problemRoot}`);
    }
    return id;
}

/** 转译 + 沙箱求值 cases 模块并校验，返回全量用例。 */
function evaluateCasesModule(casesPath: string): ProblemCases {
    if (!existsSync(casesPath)) {
        throw new CasesLoadError('cases_missing', `用例模块不存在：${casesPath}`);
    }
    const source = readFileSync(casesPath, 'utf8');
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
        fileName: casesPath,
    });
    const sandbox = { exports: {} as Record<string, unknown> };
    runInNewContext(outputText, sandbox, { filename: casesPath });
    const validation = validateCasesModule(sandbox.exports.cases, casesPath);
    if (!validation.ok) {
        throw new CasesLoadError(validation.failureKind, `cases 模块校验失败（${validation.failureKind}）：${validation.message}`);
    }
    // 沙箱求值的对象带沙箱 realm 的 `Object.prototype`；克隆回宿主 realm，
    // 保证协议编码（plain-object 守卫）与后续宿主侧结构化消费跨 lane 一致。
    return structuredClone(validation.cases);
}

/**
 * 装载题目判题用例：`<problemRoot>/<metadata.id>.cases.ts`（或显式 `casesPath`）是唯一真源，
 * 缺失即结构化失败，不回退 `metadata.json#tests`。
 */
export function loadProblemCases(problemRoot: string, casesPath?: string): LoadedProblemCases {
    const resolved = casesPath ?? join(problemRoot, `${problemSlugOf(problemRoot)}.cases.ts`);
    const cases = [...evaluateCasesModule(resolved)];
    const partitioned = partitionCases(cases);
    return {
        cases,
        executable: partitioned.executable,
        defectSkipped: partitioned.defect.length,
        source: resolved,
    };
}
