import { describe, expect, it } from 'vitest';

import { buildValkyrieDualMatrixReport } from '../src/reporting/valkyrie-dual-matrix.ts';
import type { ValkyrieMatrixRow } from '../src/adapters/valkyrie-node/matrix.ts';
import type { ValkyrieNyarMatrixRow } from '../src/adapters/valkyrie-nyar/matrix.ts';

function greenWasm(id: string): ValkyrieMatrixRow {
    return {
        id,
        target: 'wasm32-node-unknown-wasm',
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
        solverNote: null,
        green: false,
    };
}

describe('valkyrie dual matrix report', () => {
    it('summarizes wasm and nyar pass rates separately', () => {
        const report = buildValkyrieDualMatrixReport([
            { id: 'two-sum', wasm: greenWasm('two-sum'), nyar: failNyar('two-sum') },
            { id: 'three-sum', wasm: greenWasm('three-sum'), nyar: failNyar('three-sum') },
        ]);
        expect(report.denominator).toBe(2);
        expect(report.summary.wasm.green).toBe(2);
        expect(report.summary.nyar.green).toBe(0);
        expect(report.summary.wasm.greenRate).toBe(1);
        expect(report.summary.nyar.buildPassRate).toBe(0);
    });
});
