import { describe, expect, it } from 'vitest';

import { isMatrixRowGreen } from '../src/adapters/shared/matrix-green.ts';
import { isValkyrieGreen, type ValkyrieMatrixRow } from '../src/adapters/valkyrie-node/matrix.ts';
import { isValkyrieNyarGreen, type ValkyrieNyarMatrixRow } from '../src/adapters/valkyrie-nyar/matrix.ts';

// runnerHost 固定为 'node'，compile target 来自各题 manifest
const RUNNER_HOST = 'node';
const CANONICAL_TRIPLE_NODE_WASM = 'wasm32-node-unknown-wasm';

function baseNodeRow(overrides: Partial<ValkyrieMatrixRow> = {}): ValkyrieMatrixRow {
    return {
        id: 'two-sum',
        target: CANONICAL_TRIPLE_NODE_WASM,
        runnerHost: RUNNER_HOST,
        buildStatus: 0,
        testStatus: 0,
        buildRoute: 'legion build --target node',
        testRoute: 'legion test --target node',
        buildError: null,
        testError: null,
        manifestFresh: true,
        manifestError: null,
        manifestSchemaVersion: 3,
        semanticClosureHash: 'abc',
        canonicalSurfaceHash: 'def',
        hostProviderBindingHash: 'ghi',
        runtimeOk: true,
        runtimeError: null,
        testCaseTotal: 3,
        testCasePass: 3,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: null,
        solverNote: null,
        green: true,
        ...overrides,
    };
}

function baseNyarRow(overrides: Partial<ValkyrieNyarMatrixRow> = {}): ValkyrieNyarMatrixRow {
    return {
        id: 'two-sum',
        target: 'nyar-unknown-unknown-managed',
        buildStatus: 0,
        testStatus: 0,
        buildRoute: 'legion build --target nyar',
        testRoute: 'legion test --target nyar',
        buildError: null,
        testError: null,
        manifestFresh: true,
        manifestError: null,
        manifestSchemaVersion: 3,
        semanticClosureHash: 'abc',
        canonicalSurfaceHash: 'def',
        hostProviderBindingHash: 'ghi',
        runtimeOk: true,
        runtimeError: null,
        testCaseTotal: 3,
        testCasePass: 3,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: null,
        solverNote: null,
        green: true,
        ...overrides,
    };
}

describe('Valkyrie 双 target 矩阵绿门禁', () => {
    it('shared contract 与 node / nyar 包装一致', () => {
        const row = baseNodeRow();
        expect(isMatrixRowGreen(row)).toBe(isValkyrieGreen(row));
        expect(isMatrixRowGreen(baseNyarRow())).toBe(isValkyrieNyarGreen(baseNyarRow()));
    });

    it('node 绿必须同时满足 build、test、manifest 与 runtime', () => {
        expect(isValkyrieGreen(baseNodeRow())).toBe(true);
        expect(isValkyrieGreen(baseNodeRow({ buildStatus: 1 }))).toBe(false);
        expect(isValkyrieGreen(baseNodeRow({ testStatus: 1 }))).toBe(false);
        expect(isValkyrieGreen(baseNodeRow({ manifestFresh: false }))).toBe(false);
        expect(isValkyrieGreen(baseNodeRow({ runtimeOk: false }))).toBe(false);
    });

    it('nyar 绿必须同时满足 build、test、manifest 与 runtime', () => {
        expect(isValkyrieNyarGreen(baseNyarRow())).toBe(true);
        expect(isValkyrieNyarGreen(baseNyarRow({ buildStatus: 1 }))).toBe(false);
        expect(isValkyrieNyarGreen(baseNyarRow({ testStatus: 1 }))).toBe(false);
        expect(isValkyrieNyarGreen(baseNyarRow({ manifestFresh: false }))).toBe(false);
        expect(isValkyrieNyarGreen(baseNyarRow({ runtimeOk: false }))).toBe(false);
    });

    it('a row with no executed metadata cases cannot be green', () => {
        expect(isMatrixRowGreen(baseNodeRow({ testCaseTotal: 0, testCasePass: 0, testCaseFail: 0 }))).toBe(false);
        expect(isValkyrieGreen(baseNodeRow({ testCaseTotal: 2, testCasePass: 1, testCaseFail: 1 }))).toBe(false);
    });
});
