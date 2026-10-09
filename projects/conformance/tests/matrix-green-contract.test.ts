import { describe, expect, it } from 'vitest';

import { isValkyrieGreen, type ValkyrieMatrixRow } from '../src/adapters/valkyrie-node/matrix.ts';
import { isValkyrieNyarGreen, type ValkyrieNyarMatrixRow } from '../src/adapters/valkyrie-nyar/matrix.ts';

function baseNodeRow(overrides: Partial<ValkyrieMatrixRow> = {}): ValkyrieMatrixRow {
    return {
        id: 'two-sum',
        buildStatus: 0,
        testStatus: 0,
        buildRoute: 'legion build --target node',
        testRoute: 'legion test --target node',
        buildError: null,
        testError: null,
        manifestFresh: true,
        manifestError: null,
        runtimeOk: true,
        runtimeError: null,
        ...overrides,
    };
}

function baseNyarRow(overrides: Partial<ValkyrieNyarMatrixRow> = {}): ValkyrieNyarMatrixRow {
    return {
        id: 'two-sum',
        buildStatus: 0,
        testStatus: 0,
        buildRoute: 'legion build --target nyar',
        testRoute: 'legion test --target nyar',
        buildError: null,
        testError: null,
        manifestFresh: true,
        manifestError: null,
        runtimeOk: true,
        runtimeError: null,
        ...overrides,
    };
}

describe('Valkyrie 双 target 矩阵绿门禁', () => {
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
});
