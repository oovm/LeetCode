import { describe, expect, it } from 'vitest';

import { buildValkyrieLaneMatrixReport, MATRIX_LANES, type LaneQuarantine } from '../src/reporting/valkyrie-lane-matrix.ts';
import { parseCorpusQuarantine } from '../src/reporting/corpus-quarantine.ts';
import type { ValkyrieMatrixRow } from '../src/adapters/valkyrie-node/matrix.ts';
import type { ValkyrieBackendMatrixRow } from '../src/adapters/valkyrie-backend/matrix.ts';

// runnerHost 固定为 'node'（仅执行宿主），compile target 来自各题 manifest / lane 计划
const RUNNER_HOST = 'node';

function greenWasm(id: string): ValkyrieMatrixRow {
    return {
        id,
        target: 'wasm32-unknown-unknown-wasm', // 计划 canonical triple（manifest 声明）
        declaredTarget: 'wasm',
        targetSource: 'manifest',
        targetError: null,
        manifestTarget: 'wasm32-unknown-unknown-wasm',
        runtimeStatus: 'ready',
        runtimeReason: null,
        runnerHost: RUNNER_HOST,
        buildStatus: 0,
        testStatus: 0,
        buildRoute: 'native',
        testRoute: 'native',
        buildError: null,
        testError: null,
        manifestFresh: true,
        manifestError: null,
        manifestSchemaVersion: 3,
        semanticClosureHash: 'a',
        canonicalSurfaceHash: 'b',
        hostProviderBindingHash: 'c',
        runtimeOk: true,
        runtimeError: null,
        testCaseTotal: 2,
        executed_pass: 2,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
        firstFailureIndex: null,
        firstFailure: null,
        solverNote: null,
        green: true,
    };
}

/** 第 2 条用例失败的真实形态：前 2 条通过、1 条失败、后面 2 条未执行。 */
function failingWasm(id: string): ValkyrieMatrixRow {
    return {
        ...greenWasm(id),
        runtimeOk: false,
        runtimeError: 'tests[2]: expected 2, got 3',
        testCaseTotal: 5,
        executed_pass: 2,
        executed_fail: 1,
        not_run: 2,
        firstFailureIndex: 2,
        firstFailure: 'tests[2]: expected 2, got 3',
        green: false,
    };
}

function backendRow(id: string, overrides: Partial<ValkyrieBackendMatrixRow> = {}): ValkyrieBackendMatrixRow {
    return {
        id,
        target: 'ovm-unknown-unknown-managed',
        declaredTarget: 'ovm',
        targetSource: 'lane-explicit',
        targetError: null,
        manifestTarget: null,
        runtimeStatus: 'pending',
        runtimeReason: 'build 未通过，runtime 未执行',
        buildStatus: 1,
        testStatus: 0,
        buildRoute: 'native',
        testRoute: 'native',
        buildError: 'compile failed',
        testError: null,
        manifestFresh: false,
        manifestError: 'stale',
        manifestSchemaVersion: null,
        semanticClosureHash: null,
        canonicalSurfaceHash: null,
        hostProviderBindingHash: null,
        runtimeOk: false,
        runtimeError: 'compile failed',
        testCaseTotal: 2,
        executed_pass: 0,
        executed_fail: 0,
        blocked: 2,
        not_run: 0,
        firstFailureIndex: 0,
        firstFailure: 'compile failed',
        solverNote: null,
        green: false,
        ...overrides,
    };
}

function greenOvm(id: string): ValkyrieBackendMatrixRow {
    return backendRow(id, {
        manifestTarget: 'ovm-unknown-unknown-managed',
        runtimeStatus: 'ready',
        runtimeReason: null,
        buildStatus: 0,
        buildError: null,
        manifestFresh: true,
        manifestError: null,
        manifestSchemaVersion: 3,
        semanticClosureHash: 'a',
        canonicalSurfaceHash: 'b',
        hostProviderBindingHash: 'c',
        runtimeOk: true,
        runtimeError: null,
        executed_pass: 2,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
        firstFailureIndex: null,
        firstFailure: null,
        green: true,
    });
}

/** 对照 lane 因生产 lowering 未启用而在 build 阶段结构化失败的真实形态。 */
function blockedContrast(id: string, lane: 'jvm' | 'clr'): ValkyrieBackendMatrixRow {
    const reason = `目标 ${lane} 在当前构建中没有已启用的正式 lowering；拒绝切换目标或补造产物`;
    return backendRow(id, {
        target: lane === 'jvm' ? 'jvm-unknown-unknown-jvm' : 'clr-unknown-unknown-clr',
        declaredTarget: lane,
        buildError: reason,
        testError: reason,
        runtimeStatus: 'pending',
        runtimeReason: 'build 未通过，runtime 未执行',
        runtimeError: reason,
        firstFailure: reason,
        testCaseTotal: 0,
        executed_pass: 0,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
    });
}

function entry(id: string, overrides: Partial<Record<'wasm' | 'ovm' | 'jvm' | 'clr', ValkyrieMatrixRow | ValkyrieBackendMatrixRow>> = {}) {
    return {
        id,
        rows: {
            wasm: overrides.wasm ?? greenWasm(id),
            ovm: overrides.ovm ?? greenOvm(id),
            jvm: overrides.jvm ?? blockedContrast(id, 'jvm'),
            clr: overrides.clr ?? blockedContrast(id, 'clr'),
        },
    };
}

describe('valkyrie lane matrix report', () => {
    it('declares exactly the four lanes with distinct roles', () => {
        expect(MATRIX_LANES.map((lane) => lane.id)).toEqual(['wasm', 'ovm', 'jvm', 'clr']);
        const byId = new Map(MATRIX_LANES.map((lane) => [lane.id, lane]));
        expect(byId.get('wasm')?.role).toBe('delivery');
        expect(byId.get('ovm')?.role).toBe('execution');
        expect(byId.get('jvm')?.role).toBe('contrast');
        expect(byId.get('clr')?.role).toBe('contrast');
    });

    it('summarizes each lane separately without mixing counts across lanes', () => {
        const report = buildValkyrieLaneMatrixReport([entry('two-sum'), entry('three-sum')], { corpusIds: ['two-sum', 'three-sum'] });
        expect(report.denominator).toBe(2);
        expect(report.deliveryLane).toBe('wasm');
        expect(Object.keys(report.summary).sort()).toEqual(['clr', 'jvm', 'ovm', 'wasm']);
        expect(report.summary.wasm.green).toBe(2);
        expect(report.summary.ovm.green).toBe(2);
        expect(report.summary.jvm.green).toBe(0);
        expect(report.summary.clr.green).toBe(0);
        expect(report.summary.wasm.greenRate).toBe(1);
        expect(report.summary.jvm.buildPassRate).toBe(0);
        expect(report.summary.wasm.testCaseTotal).toBe(4);
        expect(report.summary.wasm.executed_pass).toBe(4);
        expect(report.summary.wasm.executed_fail).toBe(0);
        expect(report.summary.wasm.blocked).toBe(0);
        expect(report.summary.wasm.not_run).toBe(0);
        expect(report.summary.wasm.casePassRate).toBe(1);
        expect(report.summary.jvm.casePassRate).toBe(0);
        expect(report.summary.wasm.runtime).toEqual({ ready: 2, blocked: 0, pending: 0 });
        expect(report.summary.ovm.runtime).toEqual({ ready: 2, blocked: 0, pending: 0 });
        expect(report.summary.jvm.runtime).toEqual({ ready: 0, blocked: 0, pending: 2 });
    });

    it('keeps contrast lane failure reasons independent of the execution lane verdict', () => {
        const report = buildValkyrieLaneMatrixReport([entry('two-sum')], { corpusIds: ['two-sum'] });
        const jvm = report.problems[0]!.rows.jvm as ValkyrieBackendMatrixRow;
        const ovm = report.problems[0]!.rows.ovm as ValkyrieBackendMatrixRow;
        expect(ovm.green).toBe(true);
        expect(jvm.green).toBe(false);
        expect(jvm.buildError).toContain('lowering');
        expect(jvm.buildError).not.toBe(ovm.buildError);
        expect(jvm.target).not.toBe(ovm.target);
    });

    it('marks only the wasm lane as counting toward delivery', () => {
        const report = buildValkyrieLaneMatrixReport([entry('two-sum')], { corpusIds: ['two-sum'] });
        const byId = new Map(report.lanes.map((lane) => [lane.id, lane]));
        expect(byId.get('wasm')?.countsTowardDelivery).toBe(true);
        expect(byId.get('wasm')?.targetSource).toBe('manifest');
        for (const lane of ['ovm', 'jvm', 'clr'] as const) {
            expect(byId.get(lane)?.countsTowardDelivery).toBe(false);
            expect(byId.get(lane)?.targetSource).toBe('lane-explicit');
        }
    });

    it('keeps the full denominator when a selected batch is entirely green', () => {
        const report = buildValkyrieLaneMatrixReport([entry('two-sum')], { corpusIds: ['two-sum', 'three-sum'], batchLimit: 1 });
        expect(report.denominator).toBe(2);
        expect(report.summary.wasm.greenRate).toBe(0.5);
        expect(report.summary.wasm.notExecuted).toBe(1);
        expect(report.notExecutedIds).toEqual(['three-sum']);
        expect(report.complete).toBe(false);
    });

    it('excludes quarantined cases from the case denominator without claiming a re-judge', () => {
        const quarantine: LaneQuarantine = {
            source: 'test-list.json',
            caseCount: 2,
            problemCount: 1,
            indices: new Map([['two-sum', new Set([0, 2])]]),
        };
        const report = buildValkyrieLaneMatrixReport([entry('two-sum', { wasm: failingWasm('two-sum') })], {
            corpusIds: ['two-sum'],
            quarantine,
        });
        expect(report.summary.wasm.testCaseTotal).toBe(3);
        expect(report.summary.wasm.executed_pass).toBe(1);
        expect(report.summary.wasm.executed_fail).toBe(0);
        expect(report.summary.wasm.not_run).toBe(2);
        expect(report.summary.wasm.quarantinedCases).toBe(2);
        // 未配置隔离时无扣减。
        expect(report.summary.jvm.quarantinedCases).toBe(0);
        expect(report.problems[0]!.rows.wasm.green).toBe(false);
        expect(report.quarantine).toEqual({ source: 'test-list.json', caseCount: 2, problemCount: 1 });
    });

    it('parses quarantine coordinates from the sidecar manifest and ignores class D', () => {
        const manifest = JSON.stringify({
            cases: [
                { slug: 'two-sum', class: 'A', field: 'tests[3].args.k' },
                { slug: 'two-sum', class: 'S', field: 'tests[3].expected' },
                { slug: 'three-sum', class: 'A', field: 'tests[7].args.nums[2]' },
                { slug: 'three-sum', class: 'D', field: 'tests[9].args.n' },
            ],
        });
        const parsed = parseCorpusQuarantine(manifest, 'reports/fixture.json');
        expect(parsed.problemCount).toBe(2);
        expect(parsed.caseCount).toBe(2);
        expect(parsed.byProblem.get('two-sum')!.get(3)!.classes).toEqual(['A', 'S']);
        expect(parsed.byProblem.get('three-sum')!.has(9)).toBe(false);
    });

    it('rejects rows outside the corpus, duplicated identities and missing lane rows', () => {
        const good = entry('two-sum');
        expect(() => buildValkyrieLaneMatrixReport([good], { corpusIds: ['three-sum'] })).toThrow();
        expect(() => buildValkyrieLaneMatrixReport([good, good], { corpusIds: ['two-sum'] })).toThrow();
        const missingClr = { id: 'two-sum', rows: { wasm: greenWasm('two-sum'), ovm: greenOvm('two-sum'), jvm: blockedContrast('two-sum', 'jvm') } };
        expect(() => buildValkyrieLaneMatrixReport([missingClr as never], { corpusIds: ['two-sum'] })).toThrow();
        const mismatchedId = {
            id: 'two-sum',
            rows: { wasm: greenWasm('three-sum'), ovm: greenOvm('two-sum'), jvm: blockedContrast('two-sum', 'jvm'), clr: blockedContrast('two-sum', 'clr') },
        };
        expect(() => buildValkyrieLaneMatrixReport([mismatchedId], { corpusIds: ['two-sum'] })).toThrow();
    });
});
