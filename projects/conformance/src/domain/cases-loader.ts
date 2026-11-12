/**
 * 判题用例唯一装载器（统一输入快照）。
 *
 * 判题真源合同（06 账本裁定）：`<slug>.cases.ts` 是判题用例的唯一来源；
 * `metadata.json#tests` 已全量清退，任何装载路径都不得回退到 JSON 判题。
 *
 * 快照冻结合同（第六步整改）：
 * - 装载即冻结：过滤前为每条条目固定 `sourceIndex`（cases 数组原始下标）、
 *   `caseId`（`<slug>::tests[<sourceIndex>]`）与内容 `digest`；
 *   `executable` / `excluded` 只是快照的选择视图，下游禁止重新编号。
 * - 内容级快照 identity：装载器按文件内容 sha256 缓存快照，同一内容只转译求值一次，
 *   普通 runner、隔离判题器、Python 桥与报表经同一装载器消费同一快照实例。
 *
 * - TS 模块承载 `bigint` 字面量与显式 `corpusDefect` 标注，规避 JSON 的表达力
 *   与序列化损失；缺陷条目不进 pass/fail 分母，但保留冻结身份供逐例排除观察。
 * - cases 模块是纯数据 + `import type` 的 ESM；lane 装载入口多为同步函数，
 *   这里按源码文本转译（`ts.transpileModule`，ES2020/CJS）后在隔离沙箱中求值，
 *   不依赖调用方是否运行在 tsx 的 require hook 下。
 * - 缺文件/空数组 → `cases_missing` 结构化失败；schema 与数值保真违规 →
 *   `cases_schema` / `unsafe_number`，由 `validateCasesModule` 统一裁决。
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

import ts from 'typescript';

import { validateCasesModule, type CorpusDefect, type ProblemCase, type ProblemCases } from '../isolated/cases.ts';
import { solverCaseDigest, solverCaseId } from '../observation/case-identity.ts';

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

/** `corpusDefect` 条目的排除依据（随逐例 excluded observation 落账）。 */
export type CaseExclusion = { kind: string; reason: string };

/** 冻结快照条目：身份在过滤前固定，选择视图不得重新编号。 */
export type CaseSnapshotEntry = {
    /** cases 数组原始下标（装载时冻结，判题坐标唯一真源）。 */
    readonly sourceIndex: number;
    /** 稳定身份：`<slug>::tests[<sourceIndex>]`。 */
    readonly caseId: string;
    /** 条目内容（`args` + `expected`）的 sha256 摘要。 */
    readonly digest: string;
    /** 原始条目（`args`/`expected`/`corpusDefect` 原值保留）。 */
    readonly case: ProblemCase;
    /** 是否被 `corpusDefect` 标注排除出可执行分母。 */
    readonly excluded: boolean;
    /** 排除依据；非缺陷条目为 `null`。 */
    readonly exclusion: CaseExclusion | null;
};

export type LoadedProblemCases = {
    /** 全量用例（含 `corpusDefect` 标注条目，供审计与坐标对照）。 */
    cases: ProblemCase[];
    /** 全量冻结条目（含被排除条目）：下游观察链的唯一身份来源。 */
    entries: readonly CaseSnapshotEntry[];
    /** 可执行用例选择视图（判题分母）。 */
    executable: ProblemCase[];
    /** 可执行冻结条目选择视图（按 `sourceIndex` 升序）。 */
    executableEntries: readonly CaseSnapshotEntry[];
    /** 被 `corpusDefect` 排除的冻结条目选择视图。 */
    excludedEntries: readonly CaseSnapshotEntry[];
    /** 被 `corpusDefect` 排除、不计入 pass/fail 的条目数（= `excludedEntries.length`）。 */
    defectSkipped: number;
    /** 用例真源路径（`<slug>.cases.ts`）。 */
    source: string;
    /** 用例文件内容的 sha256 摘要（内容级快照 identity）。 */
    sourceDigest: string;
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
function evaluateCasesModule(casesPath: string, sourceText: string): ProblemCases {
    const { outputText } = ts.transpileModule(sourceText, {
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
 * 装载快照缓存：key = 解析后的 cases 路径，value 绑定文件内容摘要。
 * 同一内容 identity 只转译求值一次并复用同一快照实例；文件内容变化即重转译。
 * 统一文件名不等于统一快照——identity 由内容摘要证明。
 */
const snapshotCache = new Map<string, { sourceDigest: string; snapshot: LoadedProblemCases }>();

/**
 * 装载题目判题用例：`<problemRoot>/<metadata.id>.cases.ts`（或显式 `casesPath`）是唯一真源，
 * 缺失即结构化失败，不回退 `metadata.json#tests`。
 * 返回的快照在过滤前冻结全部条目的 `sourceIndex`/`caseId`/`digest`；
 * `executable`/`excluded` 只是选择视图，下游禁止按视图位置重新编号。
 */
export function loadProblemCases(problemRoot: string, casesPath?: string): LoadedProblemCases {
    const resolved = casesPath ?? join(problemRoot, `${problemSlugOf(problemRoot)}.cases.ts`);
    if (!existsSync(resolved)) {
        throw new CasesLoadError('cases_missing', `用例模块不存在：${resolved}`);
    }
    const sourceText = readFileSync(resolved, 'utf8');
    const sourceDigest = createHash('sha256').update(sourceText, 'utf8').digest('hex');
    const cached = snapshotCache.get(resolved);
    if (cached !== undefined && cached.sourceDigest === sourceDigest) {
        return cached.snapshot;
    }
    const slug = problemSlugOf(problemRoot);
    const cases = [...evaluateCasesModule(resolved, sourceText)];
    const entries: CaseSnapshotEntry[] = cases.map((entry, sourceIndex) => {
        const defect: CorpusDefect | undefined = entry.corpusDefect;
        return Object.freeze({
            sourceIndex,
            caseId: solverCaseId(slug, sourceIndex),
            digest: solverCaseDigest(entry.args, entry.expected),
            case: entry,
            excluded: defect !== undefined,
            exclusion: defect === undefined ? null : Object.freeze({ kind: defect.kind, reason: defect.reason }),
        });
    });
    const executableEntries = Object.freeze(entries.filter((entry) => !entry.excluded));
    const excludedEntries = Object.freeze(entries.filter((entry) => entry.excluded));
    const snapshot: LoadedProblemCases = {
        cases,
        entries: Object.freeze(entries),
        executable: executableEntries.map((entry) => entry.case),
        executableEntries,
        excludedEntries,
        defectSkipped: excludedEntries.length,
        source: resolved,
        sourceDigest,
    };
    snapshotCache.set(resolved, { sourceDigest, snapshot });
    return snapshot;
}
