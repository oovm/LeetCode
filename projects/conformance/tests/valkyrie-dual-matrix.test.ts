import { describe, expect, it } from 'vitest';

import { buildValkyrieDualMatrixReport } from '../src/reporting/valkyrie-dual-matrix.ts';
import type { ValkyrieMatrixRow } from '../src/adapters/valkyrie-node/matrix.ts';
import type { ValkyrieNyarMatrixRow } from '../src/adapters/valkyrie-nyar/matrix.ts';

// runnerHost 固定为 'node'，compile target 来自各题 manifest
const RUNNER_HOST = 'node';

function greenWasm(id: string): ValkyrieMatrixRow {
    return {
        id,
        target: 'wasm32-node-unknown-wasm', // execution manifest 写的 canonical triple
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
        target: 'nyar-unknown-unknown-managed',
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

describe('valkyrie dual matrix report', () => {
    it('summarizes wasm and nyar pass rates separately including case rates', () => {
        const report = buildValkyrieDualMatrixReport([
            { id: 'two-sum', wasm: greenWasm('two-sum'), nyar: failNyar('two-sum') },
            { id: 'three-sum', wasm: greenWasm('three-sum'), nyar: failNyar('three-sum') },
        ], { corpusIds: ['two-sum', 'three-sum'] });
        expect(report.denominator).toBe(2);
        expect(report.summary.wasm.green).toBe(2);
        expect(report.summary.nyar.green).toBe(0);
        expect(report.summary.wasm.greenRate).toBe(1);
        expect(report.summary.nyar.buildPassRate).toBe(0);
        expect(report.summary.wasm.testCaseTotal).toBe(4);
        expect(report.summary.wasm.casePassRate).toBe(1);
        expect(report.summary.nyar.casePassRate).toBe(0);
    });

    it('keeps the full denominator when a selected batch is entirely green', () => {
        const report = buildValkyrieDualMatrixReport([
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
        expect(() => buildValkyrieDualMatrixReport([entry], { corpusIds: ['three-sum'] })).toThrow();
        expect(() => buildValkyrieDualMatrixReport([entry, entry], { corpusIds: ['two-sum'] })).toThrow();
    });
});
