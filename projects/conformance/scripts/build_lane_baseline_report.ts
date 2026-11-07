#!/usr/bin/env node
/**
 * 汇总 TypeScript Node/Bun 与 Valkyrie wasm/ovm 的基线 JSONL，生成两份报告。
 *
 * 口径：
 * - 分母恒为 canonical 题数；`skipped` 不抵扣分母、不计入 pass。
 * - `pass` 只认「真实执行计数 == 用例总数 > 0」；`unverified` 与 `blocked` 单列，不并入失败率。
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { CONFORMANCE_ROOT } from '../src/domain/paths.ts';

type Status = 'pass' | 'fail' | 'blocked' | 'unverified';

type TsRow = {
    id: string;
    channel: 'node' | 'bun';
    status: Status;
    caseTotal: number;
    executed: number;
    ms: number;
    reason: string | null;
};

type VRow = {
    id: string;
    lane: 'wasm' | 'ovm';
    status: Status;
    target: string;
    buildStatus: number;
    manifestFresh: boolean;
    caseTotal: number;
    executedPass: number;
    executedFail: number;
    blockedCases: number;
    notRunCases: number;
    skippedCases: number;
    outcome: string;
    reason: string | null;
    ms: number;
};

function readJsonl<T>(path: string): T[] {
    let text = '';
    try {
        text = readFileSync(path, 'utf8');
    } catch {
        return [];
    }
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith('{'))
        .map((line) => JSON.parse(line) as T);
}

function reasonClusters(rows: Array<{ status: Status; reason: string | null }>, limit = 12): Array<{ status: Status; reason: string; count: number }> {
    const counts = new Map<string, { status: Status; reason: string; count: number }>();
    for (const row of rows) {
        if (!row.reason) {
            continue;
        }
        // panic 文本里的线程 id / 指针每次不同，归一化后才能聚成同一原因簇。
        const reason = row.reason
            .replace(/thread '<unnamed>' \(\d+\)/g, "thread '<unnamed>'")
            .replace(/0x[0-9a-f]{6,}/gi, '0x…');
        const key = `${row.status}\u0000${reason}`;
        const current = counts.get(key);
        if (current) {
            current.count += 1;
        } else {
            counts.set(key, { status: row.status, reason, count: 1 });
        }
    }
    return [...counts.values()].sort((left, right) => right.count - left.count).slice(0, limit);
}

function stable(value: unknown): string {
    return JSON.stringify(value);
}

function orderOnlyMismatch(reason: string): boolean {
    const match = reason.match(/expected (.+?), got (.+?)(?:（compareMode|$)/s);
    if (!match) {
        return false;
    }
    let expected: unknown;
    let actual: unknown;
    try {
        expected = JSON.parse(match[1]);
        actual = JSON.parse(match[2]);
    } catch {
        return false;
    }
    if (!Array.isArray(expected) || !Array.isArray(actual) || expected.length !== actual.length) {
        return false;
    }
    const expectedKeys = expected.map(stable).sort();
    const actualKeys = actual.map(stable).sort();
    return expectedKeys.every((key, index) => key === actualKeys[index]);
}

function tsFailureCategory(row: TsRow): string {
    if (row.status === 'pass') {
        return 'pass';
    }
    const reason = row.reason ?? '';
    if (reason.includes('solution.ts 为空')) {
        return 'empty-solver';
    }
    if (reason.includes('未导出 export class Solution')) {
        return 'missing-solution-export';
    }
    if (reason.includes('需要题面语义校验')) {
        return 'validator-required';
    }
    if (row.status === 'unverified') {
        return reason.includes('超时') ? 'timeout' : 'runner-crash';
    }
    if (reason.includes('空跑') || reason.includes('执行计数不完整')) {
        return 'no-execution-count';
    }
    if (reason.includes('metadata.tests 缺失或为空')) {
        return 'empty-tests';
    }
    if (orderOnlyMismatch(reason)) {
        return 'order-only-mismatch';
    }
    if (/RangeError|TypeError|ReferenceError|SyntaxError|Cannot find module/.test(reason)) {
        return 'load-error';
    }
    return 'assert-mismatch';
}

function summarizeTs(rows: TsRow[], total: number): Record<string, unknown> {
    const counts: Record<Status, number> = { pass: 0, fail: 0, blocked: 0, unverified: 0 };
    let caseTotal = 0;
    let executed = 0;
    const categoryCounts = new Map<string, number>();
    const failures: Array<{ id: string; status: Status; category: string; reason: string | null; caseTotal: number; executed: number }> = [];
    for (const row of rows) {
        counts[row.status] += 1;
        caseTotal += row.caseTotal;
        executed += row.executed;
        const category = tsFailureCategory(row);
        categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
        if (row.status !== 'pass') {
            failures.push({ id: row.id, status: row.status, category, reason: row.reason, caseTotal: row.caseTotal, executed: row.executed });
        }
    }
    return {
        total,
        attempted: rows.length,
        ...counts,
        missing: total - rows.length,
        caseTotal,
        executed,
        passedCases: rows.filter((row) => row.status === 'pass').reduce((sum, row) => sum + row.caseTotal, 0),
        categoryCounts: Object.fromEntries([...categoryCounts.entries()].sort((left, right) => right[1] - left[1])),
        orderOnlyMismatch: failures.filter((item) => item.category === 'order-only-mismatch').map((item) => item.id),
        byReason: reasonClusters(rows),
        failures,
    };
}

/** V 失败归类：只按已记录证据分桶，不把载荷/测试数据缺陷算成编译器缺陷。 */
function vFailureCategory(reason: string | null): string {
    const text = reason ?? '';
    if (/AbiSchemaError|metadata\.tests/.test(text)) return 'test-data';
    if (/parse args-json|serialize result|type mismatch/.test(text)) return 'abi-contract';
    if (/legion build --target \S+ failed|compile pipeline rejected/.test(text)) return 'build-failure';
    if (/FATAL ERROR|heap out of memory|panicked at/.test(text)) return 'runtime-crash';
    if (/ValkyrieEntryContractError/.test(text)) return 'entry-contract';
    if (/未落盘|没有可导出符号|runtime pending/.test(text)) return 'runtime-pending';
    if (/需要题面语义校验/.test(text)) return 'validator-required';
    if (/skipped=/.test(text)) return 'skipped-not-pass';
    if (/超时/.test(text)) return 'timeout';
    if (orderOnlyMismatch(text)) return 'order-only-mismatch';
    return 'assert-mismatch';
}

/** 报告正文只展示单行摘要；完整诊断保留在 JSONL。 */
function shortReason(reason: string | null, max = 260): string {
    if (!reason) return '';
    const text = reason
        .replace(/`.nyar` 没有可导出符号/, 'OVM 产物没有可导出符号')
        .replace(/\s+/g, ' ')
        .trim();
    return text.length > max ? `${text.slice(0, max)}…` : text;
}

function summarizeV(rows: VRow[], total: number): Record<string, unknown> {
    const counts: Record<Status, number> = { pass: 0, fail: 0, blocked: 0, unverified: 0 };
    let caseTotal = 0;
    let executedPass = 0;
    let executedFail = 0;
    let blockedCases = 0;
    let notRunCases = 0;
    let skippedCases = 0;
    const failures: Array<{ id: string; status: Status; category: string; reason: string | null; caseTotal: number; executedPass: number; executedFail: number }> = [];
    const categoryCounts: Record<string, number> = {};
    for (const row of rows) {
        // 早期批次可能把 `outcome=blocked` 记成 unverified；统一归位到 blocked 桶。
        const status = row.outcome === 'blocked' && row.status === 'unverified' ? 'blocked' : row.status;
        counts[status] += 1;
        caseTotal += row.caseTotal;
        executedPass += row.executedPass;
        executedFail += row.executedFail;
        blockedCases += row.blockedCases;
        notRunCases += row.notRunCases;
        skippedCases += row.skippedCases;
        if (status !== 'pass') {
            const category = vFailureCategory(row.reason);
            categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
            failures.push({
                id: row.id,
                status,
                category,
                reason: row.reason,
                caseTotal: row.caseTotal,
                executedPass: row.executedPass,
                executedFail: row.executedFail,
            });
        }
    }
    return {
        total,
        attempted: rows.length,
        ...counts,
        missing: total - rows.length,
        caseTotal,
        executedPass,
        executedFail,
        blockedCases,
        notRunCases,
        skippedCases,
        categoryCounts,
        byReason: reasonClusters(rows),
        failures,
    };
}

function writeMarkdown(path: string, text: string): void {
    writeFileSync(path, text, 'utf8');
}

/** 记录本次 V 基线实际加载的 native 产物身份；解析顺序与 `@nyar/valkyrie` 一致：环境变量优先，其次平台包。 */
function nativeToolchain(): { path: string; bytes: number; sha256: string; mtime: string } | null {
    try {
        const path = process.env.VALKYRIE_NATIVE ?? createRequire(import.meta.url).resolve('@nyar/valkyrie-win32-x64');
        const stat = statSync(path);
        const sha256 = createHash('sha256').update(readFileSync(path)).digest('hex');
        return { path, bytes: stat.size, sha256, mtime: stat.mtime.toISOString() };
    } catch {
        return null;
    }
}

function statusTable(summary: Record<string, unknown>): string {
    const get = (key: string): number => Number(summary[key] ?? 0);
    return [
        '| 指标 | 数量 |',
        '| --- | --- |',
        `| 范围总数（分母） | ${get('total')} |`,
        `| 实际尝试 | ${get('attempted')} |`,
        `| 通过（真实执行计数完整） | ${get('pass')} |`,
        `| 失败（已执行但不一致） | ${get('fail')} |`,
        `| blocked（无法执行） | ${get('blocked')} |`,
        `| 未验证（超时 / runtime pending / skipped） | ${get('unverified')} |`,
        `| 未尝试（runner 未覆盖） | ${get('missing')} |`,
    ].join('\n');
}

function batchTable(batches: Array<Record<string, unknown>>, keys: string[]): string {
    if (batches.length === 0) {
        return '无批次汇总日志，逐题结果见对应 JSONL。';
    }
    const header = `| 范围 | ${keys.map((key) => key.replace(/^./, (ch) => ch.toUpperCase())).join(' | ')} |`;
    const divider = `| --- | ${keys.map(() => '---').join(' | ')} |`;
    const rows = batches.map((batch) => {
        const cells = keys.map((key) => String(batch[key] ?? 0));
        return `| ${batch.offset}-${Number(batch.offset) + Number(batch.attempted)} | ${cells.join(' | ')} |`;
    });
    return [header, divider, ...rows].join('\n');
}

function main(): void {
    const cache = join(CONFORMANCE_ROOT, '.cache');
    const reports = join(CONFORMANCE_ROOT, 'reports');
    mkdirSync(reports, { recursive: true });

    const total = 1161;
    const nodeRows = readJsonl<TsRow>(join(cache, 'ts-baseline-node.jsonl'));
    const bunRows = readJsonl<TsRow>(join(cache, 'ts-baseline-bun.jsonl'));
    const wasmRows = readJsonl<VRow>(join(cache, 'v-baseline-wasm.jsonl'));
    const ovmRows = readJsonl<VRow>(join(cache, 'v-baseline-ovm.jsonl'));

    const nodeSummary = summarizeTs(nodeRows, total);
    const bunSummary = summarizeTs(bunRows, total);
    const wasmSummary = summarizeV(wasmRows, total);
    const ovmSummary = summarizeV(ovmRows, total);

    const nodePass = new Set(nodeRows.filter((row) => row.status === 'pass').map((row) => row.id));
    const bunPass = new Set(bunRows.filter((row) => row.status === 'pass').map((row) => row.id));
    const wasmPass = new Set(wasmRows.filter((row) => row.status === 'pass').map((row) => row.id));
    const ovmPass = new Set(ovmRows.filter((row) => row.status === 'pass').map((row) => row.id));

    const crossChannel = {
        bothPass: [...nodePass].filter((id) => bunPass.has(id)).length,
        nodeOnlyPass: [...nodePass].filter((id) => !bunPass.has(id)).length,
        bunOnlyPass: [...bunPass].filter((id) => !nodePass.has(id)).length,
        neitherPass: total - new Set([...nodePass, ...bunPass]).size,
    };
    const wasmIds = new Set(wasmRows.map((row) => row.id));
    const ovmIds = new Set(ovmRows.map((row) => row.id));
    const sharedIds = [...wasmIds].filter((id) => ovmIds.has(id));
    const crossTarget = {
        compared: sharedIds.length,
        bothPass: sharedIds.filter((id) => wasmPass.has(id) && ovmPass.has(id)).length,
        wasmOnlyPass: sharedIds.filter((id) => wasmPass.has(id) && !ovmPass.has(id)).length,
        ovmOnlyPass: sharedIds.filter((id) => ovmPass.has(id) && !wasmPass.has(id)).length,
        neitherPass: sharedIds.filter((id) => !wasmPass.has(id) && !ovmPass.has(id)).length,
        notCompared: total - sharedIds.length,
    };

    const tsReport = {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        scope: {
            total,
            definition: 'V canonical：存在非空 `solvers/valkyrie/solution.v` 且无阻塞标记的题目，TS lane 取同一集合以便与 V 对比',
        },
        policy: {
            pass: '只有 runner 退出 0 且报告 caseTotal === executed > 0 才记通过',
            emptyRun: '空 solution.ts / 缺 `export class Solution` 显式记 fail',
            skipped: 'skipped 不抵扣分母、不计入 pass',
            unverified: '超时 / 子进程崩溃 / 无结构化执行计数单列，不并入 pass',
        },
        channels: { node: nodeSummary, bun: bunSummary },
        crossChannel,
    };
    writeFileSync(join(reports, 'typescript-lane-baseline.json'), `${JSON.stringify(tsReport, null, 2)}\n`, 'utf8');

    const native = nativeToolchain();
    const vReport = {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        scope: {
            total,
            definition: 'V canonical：存在非空 `solvers/valkyrie/solution.v` 且无阻塞标记的题目',
        },
        toolchain: native
            ? { ...native, caveat: '本次为本地工具链实测，二进制可能包含兄弟仓未提交改动，不等同发布 pin 复验' }
            : { caveat: '未能解析 native 产物路径' },
        policy: {
            pass: 'build 成功 + manifest 新鲜 + executed_pass === testCaseTotal > 0',
            disjoint: 'wasm 与 ovm 各自独立探测；一个 target 的通过数不能替代另一个',
            skipped: 'skipped 不抵扣分母、不计入 pass',
            blocked: '题解缺失 / target 计划失败 / 子进程崩溃（含 napi panic）单列',
            stalenyar: 'ovm 构建前只清除输出目录内的旧 `.nyar` 文件（当前产物身份为 `.odin`，旧 `.nyar` 会让 `legion build` 拒绝重建）',
        },
        targets: { wasm: wasmSummary, ovm: ovmSummary },
        crossTarget,
    };
    writeFileSync(join(reports, 'valkyrie-dual-target-baseline.json'), `${JSON.stringify(vReport, null, 2)}\n`, 'utf8');

    const batchSummaries = (path: string): Array<Record<string, unknown>> =>
        readJsonl<Record<string, unknown>>(path);
    const tsBatches = [
        ...batchSummaries(join(cache, 'ts-node-run.log')),
        ...batchSummaries(join(cache, 'ts-bun-run.log')),
    ];
    const vBatches = [
        ...batchSummaries(join(cache, 'v-wasm-run.log')),
        ...batchSummaries(join(cache, 'v-ovm-run.log')),
    ];

    const tsMd = [
        '# TypeScript lane 基线',
        '',
        '判题绿只证明「与 `metadata.tests[].expected` 一致」，不证明「与题面一致」。本报告只记录真实执行计数。',
        '',
        '## 范围',
        '',
        `- 分母：${total} 题（V canonical，TS 与 V 取同一集合）。`,
        '- Node 与 Bun 各自独立执行；一个通道的通过数不能替代另一个。',
        '',
        '## Node',
        '',
        statusTable(nodeSummary),
        '',
        '### 失败分类',
        '',
        ...Object.entries(nodeSummary.categoryCounts as Record<string, number>).map(([category, count]) => `- ${category}: ${count}`),
        '',
        `### 顺序类疑似比较方式缺陷（与 expected 来源无关）`,
        '',
        ...(((nodeSummary.orderOnlyMismatch as string[]).length
            ? (nodeSummary.orderOnlyMismatch as string[]).map((id) => `- ${id}`)
            : ['- 无'])),
        '',
        '### 批次',
        '',
        batchTable(tsBatches.filter((batch) => batch.channel === 'node'), ['attempted', 'pass', 'fail', 'blocked', 'unverified', 'caseTotal', 'executed', 'seconds']),
        '',
        '## Bun',
        '',
        statusTable(bunSummary),
        '',
        '### 失败分类',
        '',
        ...Object.entries(bunSummary.categoryCounts as Record<string, number>).map(([category, count]) => `- ${category}: ${count}`),
        '',
        `### 顺序类疑似比较方式缺陷（与 expected 来源无关）`,
        '',
        ...(((bunSummary.orderOnlyMismatch as string[]).length
            ? (bunSummary.orderOnlyMismatch as string[]).map((id) => `- ${id}`)
            : ['- 无'])),
        '',
        '### 批次',
        '',
        batchTable(tsBatches.filter((batch) => batch.channel === 'bun'), ['attempted', 'pass', 'fail', 'blocked', 'unverified', 'caseTotal', 'executed', 'seconds']),
        '',
        '## 跨通道',
        '',
        `- Node 与 Bun 都通过：${crossChannel.bothPass}`,
        `- 仅 Node 通过：${crossChannel.nodeOnlyPass}`,
        `- 仅 Bun 通过：${crossChannel.bunOnlyPass}`,
        `- 两者未通过：${crossChannel.neitherPass}`,
        '',
        '## 失败原因簇',
        '',
        ...['node', 'bun'].flatMap((channel) => {
            const summary = channel === 'node' ? nodeSummary : bunSummary;
            const clusters = summary.byReason as Array<{ status: Status; reason: string; count: number }>;
            return [`### ${channel}`, '', ...(clusters.length ? clusters.map((item) => `- ${item.count} × [${item.status}] ${item.reason}`) : ['- 无']), ''];
        }),
        '## 逐题失败清单',
        '',
        ...['node', 'bun'].flatMap((channel) => {
            const summary = channel === 'node' ? nodeSummary : bunSummary;
            const failures = summary.failures as Array<{ id: string; status: Status; category: string; reason: string | null }>;
            return [`### ${channel}`, '', ...(failures.length ? failures.map((item) => `- ${item.id} [${item.status}/${item.category}] ${item.reason ?? ''}`) : ['- 无']), ''];
        }),
    ].join('\n');
    writeMarkdown(join(reports, 'typescript-lane-baseline.md'), `${tsMd}\n`);

    const vMd = [
        '# Valkyrie 双 target 基线',
        '',
        '判题绿只证明「与 `metadata.tests[].expected` 一致」，不证明「与题面一致」。',
        '',
        '## 范围',
        '',
        `- 分母：${total} 题（V canonical）。`,
        '- `wasm` 与 `ovm` 各自独立构建、独立真跑、独立记账；任一 target 绿不能替代另一个。',
        '- 超时、runtime pending、skipped 单列「未验证」；子进程崩溃与题解缺失单列 `blocked`。',
        '',
        '## 环境前提',
        '',
        '- `@nyar/valkyrie` 的 `dist/` 必须与源码一致。当前源码已把 OVM 产物入口从 `.nyar` 迁到 `.odin`；旧 `dist` 仍只查 `.nyar`，会把全部 `ovm` 记成「build 成功但未落盘可执行产物入口」。',
        '- `ovm` 输出目录里的旧 `.nyar` 会让 `legion build` 拒绝重建；基线在每题构建前只删除本目录内的 `.nyar` 文件。',
        native
            ? `- 本次 native 产物：\`${native.path}\`（${native.bytes} bytes，mtime ${native.mtime}，sha256 \`${native.sha256}\`）。`
            : '- 本次未能解析 native 产物路径。',
        '- 该 native 是本地工具链实测产物，可能包含兄弟仓未提交改动；数字只代表本次本地环境，不等同已发布 pin 复验。',
        '',
        '## wasm',
        '',
        statusTable(wasmSummary),
        '',
        '### 失败分类',
        '',
        ...(Object.entries(wasmSummary.categoryCounts as Record<string, number>).length
            ? Object.entries(wasmSummary.categoryCounts as Record<string, number>).map(([category, count]) => `- ${category}: ${count}`)
            : ['- 无']),
        '',
        '### 批次',
        '',
        batchTable(vBatches.filter((batch) => batch.lane === 'wasm'), ['attempted', 'pass', 'fail', 'blocked', 'unverified', 'caseTotal', 'executedPass', 'seconds']),
        '',
        '## ovm',
        '',
        statusTable(ovmSummary),
        '',
        '### 失败分类',
        '',
        ...(Object.entries(ovmSummary.categoryCounts as Record<string, number>).length
            ? Object.entries(ovmSummary.categoryCounts as Record<string, number>).map(([category, count]) => `- ${category}: ${count}`)
            : ['- 无']),
        '',
        '### 批次',
        '',
        batchTable(vBatches.filter((batch) => batch.lane === 'ovm'), ['attempted', 'pass', 'fail', 'blocked', 'unverified', 'caseTotal', 'executedPass', 'seconds']),
        '',
        '## 跨 target',
        '',
        `- 已对比（两 target 都有记录）：${crossTarget.compared}`,
        `- wasm 与 ovm 都通过：${crossTarget.bothPass}`,
        `- 仅 wasm 通过：${crossTarget.wasmOnlyPass}`,
        `- 仅 ovm 通过：${crossTarget.ovmOnlyPass}`,
        `- 两者未通过：${crossTarget.neitherPass}`,
        `- 未对比（任一 target 无记录）：${crossTarget.notCompared}`,
        '',
        '## 失败原因簇',
        '',
        ...['wasm', 'ovm'].flatMap((lane) => {
            const summary = lane === 'wasm' ? wasmSummary : ovmSummary;
            const clusters = summary.byReason as Array<{ status: Status; reason: string; count: number }>;
            return [`### ${lane}`, '', ...(clusters.length ? clusters.map((item) => `- ${item.count} × [${item.status}] ${shortReason(item.reason)}`) : ['- 无']), ''];
        }),
        '## 逐题失败清单',
        '',
        ...['wasm', 'ovm'].flatMap((lane) => {
            const summary = lane === 'wasm' ? wasmSummary : ovmSummary;
            const failures = summary.failures as Array<{ id: string; status: Status; category: string; reason: string | null; executedPass: number; executedFail: number; caseTotal: number }>;
            return [`### ${lane}`, '', ...(failures.length ? failures.map((item) => `- ${item.id} [${item.status}/${item.category}] pass=${item.executedPass}/${item.caseTotal} ${shortReason(item.reason, 160)}`) : ['- 无']), ''];
        }),
    ].join('\n');
    writeMarkdown(join(reports, 'valkyrie-dual-target-baseline.md'), `${vMd}\n`);

    console.log(JSON.stringify({
        ts: { node: { pass: nodeSummary.pass, fail: nodeSummary.fail, blocked: nodeSummary.blocked, unverified: nodeSummary.unverified }, bun: { pass: bunSummary.pass, fail: bunSummary.fail, blocked: bunSummary.blocked, unverified: bunSummary.unverified }, crossChannel },
        v: { wasm: { pass: wasmSummary.pass, fail: wasmSummary.fail, blocked: wasmSummary.blocked, unverified: wasmSummary.unverified }, ovm: { pass: ovmSummary.pass, fail: ovmSummary.fail, blocked: ovmSummary.blocked, unverified: ovmSummary.unverified }, crossTarget },
    }));
}

main();
