import { describe, expect, it } from 'vitest';

import { buildValkyrieLaneMatrixReport } from '../src/reporting/valkyrie-lane-matrix.ts';
import type { ValkyrieMatrixRow } from '../src/adapters/valkyrie-node/matrix.ts';
import type { ValkyrieNyarMatrixRow } from '../src/adapters/valkyrie-nyar/matrix.ts';

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
        testCasePass: 2,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: null,
        solverNote: null,
        green: true,
    };
}

function failNyar(id: string): ValkyrieNyarMatrixRow {
    return {
        id,
        target: 'ovm-unknown-unknown-managed', // lane 显式 target 的 canonical triple
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
        testCasePass: 0,
        testCaseFail: 2,
        firstFailureIndex: 0,
        firstFailure: 'compile failed',
        solverNote: null,
        green: false,
    };
}

describe('valkyrie lane matrix report', () => {
    it('summarizes the wasm delivery lane and the legacy nyar lane separately', () => {
        const report = buildValkyrieLaneMatrixReport([
            { id: 'two-sum', wasm: greenWasm('two-sum'), nyar: failNyar('two-sum') },
            { id: 'three-sum', wasm: greenWasm('three-sum'), nyar: failNyar('three-sum') },
        ], { corpusIds: ['two-sum', 'three-sum'] });
        expect(report.denominator).toBe(2);
        expect(report.deliveryLane).toBe('wasm');
        expect(report.summary.wasm.green).toBe(2);
        expect(report.summary.nyar.green).toBe(0);
        expect(report.summary.wasm.greenRate).toBe(1);
        expect(report.summary.nyar.buildPassRate).toBe(0);
        expect(report.summary.wasm.testCaseTotal).toBe(4);
        expect(report.summary.wasm.casePassRate).toBe(1);
        expect(report.summary.nyar.casePassRate).toBe(0);
        expect(report.summary.wasm.runtime).toEqual({ ready: 2, blocked: 0, pending: 0 });
        expect(report.summary.nyar.runtime).toEqual({ ready: 0, blocked: 0, pending: 2 });
    });

    it('marks only the wasm lane as counting toward delivery', () => {
        const report = buildValkyrieLaneMatrixReport([
            { id: 'two-sum', wasm: greenWasm('two-sum'), nyar: failNyar('two-sum') },
        ], { corpusIds: ['two-sum'] });
        const byId = new Map(report.lanes.map((lane) => [lane.id, lane]));
        expect(byId.get('wasm')?.countsTowardDelivery).toBe(true);
        expect(byId.get('wasm')?.targetSource).toBe('manifest');
        expect(byId.get('nyar')?.countsTowardDelivery).toBe(false);
        expect(byId.get('nyar')?.targetSource).toBe('lane-explicit');
    });

    it('keeps the full denominator when a selected batch is entirely green', () => {
        const report = buildValkyrieLaneMatrixReport([
            { id: 'two-sum', wasm: greenWasm('two-sum'), nyar: failNyar('two-sum') },
        ], { corpusIds: ['two-sum', 'three-sum'], batchLimit: 1 });
        expect(report.denominator).toBe(2);
        expect(report.summary.wasm.greenRate).toBe(0.5);
        expect(report.summary.wasm.notExecuted).toBe(1);
        expect(report.notExecutedIds).toEqual(['three-sum']);
        expect(report.complete).toBe(false);
    });

    it('rejects rows outside the corpus and duplicated execution identities', () => {
        const entry = { id: 'two-sum', wasm: greenWasm('two-sum'), nyar: failNyar('two-sum') };
        expect(() => buildValkyrieLaneMatrixReport([entry], { corpusIds: ['three-sum'] })).toThrow();
        expect(() => buildValkyrieLaneMatrixReport([entry, entry], { corpusIds: ['two-sum'] })).toThrow();
    });
});
