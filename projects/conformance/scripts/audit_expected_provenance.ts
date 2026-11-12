/**
 * expected 溯源审计：把 2026-11-07 宿主异常清理涉及的 3915 条异常文本逐条打上
 * `expectedProvenance`，并给独立重算题目标记 `independent-recompute`。
 *
 * 数据来源：
 * - 3878 条已在 `951a53ca8` 作废：从该提交的父版本 metadata 逐条枚举，来源归为
 *   `reference-runtime-backfill`（参考解运行时把异常当结果落盘）；
 * - 37 条留在 3 个 dirty metadata（保护未动）：无独立证据，归为 `untraced`，
 *   不得计入绿；
 * - 14 题 1131 条已独立重算：`independent-recompute`，证据见
 *   `reports/oracle-independent-recompute.md`。
 *
 * 输出 `reports/expected-provenance.json` + `.md`。计数必须与
 * `host-error-expected-audit.json` 对齐，否则脚本以非零退出。
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { loadProblemCases } from '../src/domain/cases-loader.ts';
import { CONFORMANCE_ROOT, LEETCODE_ROOT } from '../src/domain/paths.ts';

const REPORT_DIR = join(CONFORMANCE_ROOT, 'reports');
const HOST_AUDIT = join(REPORT_DIR, 'host-error-expected-audit.json');
const CLEANUP_COMMIT = '951a53ca8';

type ExpectedProvenance =
    | 'independent-recompute'
    | 'reference-runtime-backfill'
    | 'hand-written'
    | 'untraced';

type TestCase = { args: unknown; expected: unknown };
type Metadata = { id: string; tests: TestCase[] };
type AuditEntry = {
    schemaVersion: number;
    byKind: Record<string, number>;
    beforeCases: number;
    removedCases: number;
    afterCases: number;
    problems: number;
    blockedCount: number;
    cleanedCount: number;
    protectedCount: number;
};

type HostAudit = {
    summary: AuditEntry;
    blocked: Array<{ id: string; removed: number }>;
    cleaned: Array<{ id: string; removed: number }>;
    protectedProblems: Array<{ id: string; total: number; bad: number }>;
};

type ProvenanceEntry = {
    problemId: string;
    caseIndex: number;
    expected: string;
    kind: string;
    provenance: ExpectedProvenance;
    disposition: 'removed-in-cleanup' | 'retained-dirty';
};

/** 现存用例真源是 `<slug>.cases.ts`（JSON 判题已清退）；下标与清理前 metadata 逐字一致。 */
function readMetadataFromDisk(problemId: string): Metadata {
    const cases = loadProblemCases(join(LEETCODE_ROOT, 'projects', 'problems', problemId)).cases;
    return { id: problemId, tests: cases as TestCase[] };
}

function readMetadataFromCleanupParent(problemId: string): Metadata {
    const text = execFileSync(
        'git',
        ['show', `${CLEANUP_COMMIT}^:projects/problems/${problemId}/metadata.json`],
        { cwd: LEETCODE_ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
    return JSON.parse(text) as Metadata;
}

function classifyKind(expected: string): string {
    if (expected === 'Execution timed out') {
        return 'timeout';
    }
    if (expected.includes('maximum recursion depth exceeded') || expected.includes('RecursionError')) {
        return 'recursion';
    }
    if (expected.includes('index out of range') || expected.includes('IndexError')) {
        return 'index';
    }
    if (expected.includes('negative shift count') || expected.includes('shift count')) {
        return 'shift';
    }
    return 'other-error';
}

function isAbnormal(expected: unknown): expected is string {
    return typeof expected === 'string' && (expected.startsWith('Error:') || expected === 'Execution timed out');
}

const hostAudit = JSON.parse(readFileSync(HOST_AUDIT, 'utf8')) as HostAudit;
const entries: ProvenanceEntry[] = [];
const violations: string[] = [];

for (const problem of [...hostAudit.blocked, ...hostAudit.cleaned]) {
    const metadata = readMetadataFromCleanupParent(problem.id);
    const abnormal = metadata.tests
        .map((test, index) => ({ test, index }))
        .filter(({ test }) => isAbnormal(test.expected));
    if (abnormal.length !== problem.removed) {
        violations.push(`${problem.id}: 父版本异常 ${abnormal.length} 条，审计记 ${problem.removed} 条`);
    }
    for (const { test, index } of abnormal) {
        entries.push({
            problemId: problem.id,
            caseIndex: index,
            expected: test.expected as string,
            kind: classifyKind(test.expected as string),
            provenance: 'reference-runtime-backfill',
            disposition: 'removed-in-cleanup',
        });
    }
}

for (const problem of hostAudit.protectedProblems) {
    const metadata = readMetadataFromDisk(problem.id);
    const abnormal = metadata.tests
        .map((test, index) => ({ test, index }))
        .filter(({ test }) => isAbnormal(test.expected));
    if (abnormal.length !== problem.bad) {
        violations.push(`${problem.id}: 现存异常 ${abnormal.length} 条，审计记 ${problem.bad} 条`);
    }
    for (const { test, index } of abnormal) {
        entries.push({
            problemId: problem.id,
            caseIndex: index,
            expected: test.expected as string,
            kind: classifyKind(test.expected as string),
            provenance: 'untraced',
            disposition: 'retained-dirty',
        });
    }
}

const byKind: Record<string, number> = {};
const byProvenance: Record<string, number> = {
    'independent-recompute': 0,
    'reference-runtime-backfill': 0,
    'hand-written': 0,
    untraced: 0,
};
for (const entry of entries) {
    byKind[entry.kind] = (byKind[entry.kind] ?? 0) + 1;
    byProvenance[entry.provenance] += 1;
}

const summary = hostAudit.summary;
const retainedAbnormal = hostAudit.protectedProblems.reduce((sum, problem) => sum + problem.bad, 0);
if (entries.length !== summary.removedCases + retainedAbnormal) {
    violations.push(`逐条枚举 ${entries.length} 条，审计记 ${summary.removedCases + retainedAbnormal} 条`);
}
if (byProvenance['reference-runtime-backfill'] !== summary.removedCases) {
    violations.push(
        `reference-runtime-backfill ${byProvenance['reference-runtime-backfill']} 条，审计记作废 ${summary.removedCases} 条`,
    );
}
if (byProvenance.untraced !== retainedAbnormal) {
    violations.push(`untraced ${byProvenance.untraced} 条，审计记保留 ${retainedAbnormal} 条`);
}

const recompute = JSON.parse(
    readFileSync(join(REPORT_DIR, 'oracle-independent-recompute.json'), 'utf8'),
) as { problems?: Array<{ id: string; total?: number }> } | Array<{ id: string; total?: number }>;

const recomputeProblems = Array.isArray(recompute) ? recompute : (recompute.problems ?? []);
const recomputeCases = recomputeProblems.reduce((sum, problem) => sum + (problem.total ?? 0), 0);

const report = {
    schemaVersion: 1,
    date: '2026-11-08',
    policy:
        '异常文本 expected 不是答案：能证明来自参考解运行时的标记 reference-runtime-backfill 并在 951a53ca8 作废；'
        + '留在 dirty metadata 的标记 untraced，不得计入绿；独立重算题目标记 independent-recompute。',
    cleanup: {
        commit: CLEANUP_COMMIT,
        parentSource: `${CLEANUP_COMMIT}^:projects/problems/<id>/metadata.json`,
    },
    summary: {
        abnormalExpected: entries.length,
        retainedAbnormalExpected: retainedAbnormal,
        byKind,
        byProvenance,
        problems: hostAudit.summary.problems + hostAudit.summary.protectedCount,
        blocked: summary.blockedCount,
        cleaned: summary.cleanedCount,
        protected: summary.protectedCount,
    },
    recompute: {
        provenance: 'independent-recompute',
        evidence: 'reports/oracle-independent-recompute.md',
        cases: recomputeCases,
        problems: recomputeProblems.length,
    },
    greenRule:
        'testCaseTotal > 0 && executed_pass === testCaseTotal && fail/blocked/not_run === 0；'
        + 'skipped 不抵扣分母；untraced 的 expected 不得计入绿。',
    entries,
    violations,
};

writeFileSync(join(REPORT_DIR, 'expected-provenance.json'), `${JSON.stringify(report, null, 2)}\n`);

const kindTable = Object.entries(byKind)
    .sort((left, right) => right[1] - left[1])
    .map(([kind, count]) => `| \`${kind}\` | ${count} |`)
    .join('\n');
const untraced = entries.filter((entry) => entry.provenance === 'untraced');

const markdown = `# expected 溯源审计（2026-11-08）

- 口径：2026-11-07 宿主异常清理涉及的 **3915** 条异常文本 expected 逐条打标。
- 数据来源：已作废的 3878 条从 \`${CLEANUP_COMMIT}^\` 的 metadata 逐条重放；37 条仍在 3 个 dirty
  metadata，按保护规则未动。
- 逐条结果：\`reports/expected-provenance.json\`（每条含 \`problemId\` / \`caseIndex\` / \`kind\` /
  \`provenance\` / \`disposition\`）。

## 分类

| kind | 条数 |
| --- | --- |
${kindTable}

> 逐条重放按消息内容分类：含 \`index out of range\` 一律计 \`index\`。原审计聚合把其中 371 条
> 归入 \`other-error\`（\`index\` 1397 / \`other-error\` 1673），总和仍是 3915；逐条结果以本文为准。

## 溯源

| provenance | 条数 | 处置 | 是否可计入绿 |
| --- | --- | --- | --- |
| \`reference-runtime-backfill\` | ${byProvenance['reference-runtime-backfill']} | 已作废（\`${CLEANUP_COMMIT}\`） | 否（用例已删除） |
| \`untraced\` | ${byProvenance.untraced} | 保留在 dirty metadata | **否** |
| \`independent-recompute\` | ${report.recompute.cases}（14 题） | 独立口径重算一致 | 是（证据见 \`oracle-independent-recompute.md\`） |
| \`hand-written\` | 0 | 无 | — |

## 未溯源明细（37 条，不得计入绿）

${untraced.map((entry) => `- \`${entry.problemId}\` tests[${entry.caseIndex}]：\`${entry.expected}\`（${entry.kind}）`).join('\n')}

## 重算

- 原记账 331 条「参考解生成」已扩为 14 题 1131 条全量重算，0 条不一致。
- 首轮 5 条不一致均归因为重算脚本自身实现错误，未覆盖原期望值。

## 绿口径

- \`testCaseTotal > 0 && executed_pass === testCaseTotal && fail/blocked/not_run === 0\`。
- \`skipped\` 是未执行用例，不抵扣分母。
- 未溯源（\`untraced\`）的 expected 不得计入绿。

${violations.length > 0 ? `## 对账失败\n\n${violations.map((item) => `- ${item}`).join('\n')}\n` : ''}`;

writeFileSync(join(REPORT_DIR, 'expected-provenance.md'), markdown);

if (violations.length > 0) {
    console.error(violations.join('\n'));
    process.exitCode = 1;
} else {
    console.log(
        `expected-provenance: ${entries.length} 条（${byProvenance['reference-runtime-backfill']} backfill / `
        + `${byProvenance.untraced} untraced / ${report.recompute.cases} recompute）`,
    );
}
