import { describe, expect, it } from 'vitest';

import {
    emptySolverCaseStats,
    extractTestFailureIndex,
    formatSolverResultLine,
    isBlockedSolverMessage,
    parseSolverResultLine,
} from '../src/adapters/shared/solver-case-stats.ts';

describe('solver case stats marker', () => {
    it('round-trips marker line', () => {
        const stats = {
            ok: true,
            testCaseTotal: 3,
            executed_pass: 3,
            executed_fail: 0,
            blocked: 0,
            not_run: 0,
            firstFailureIndex: null,
            firstFailure: null,
        };
        const parsed = parseSolverResultLine(`noise\n${formatSolverResultLine(stats)}\n`);
        expect(parsed).toEqual(stats);
    });

    it('parses first failure index from error text', () => {
        expect(extractTestFailureIndex('tests[2]: expected 1, got 0')).toBe(2);
        expect(extractTestFailureIndex('unrelated')).toBeNull();
        expect(emptySolverCaseStats('blocked').firstFailure).toBe('blocked');
    });

    it('classifies infrastructure blocks separately from executed failures', () => {
        expect(isBlockedSolverMessage('Error: [wasm-js-glue] Cannot marshal schema kind "NamedAggregate"')).toBe(true);
        expect(isBlockedSolverMessage('Error: [wasm-js-glue] Cannot demarshal NamedAggregate "ArrayList"')).toBe(true);
        expect(isBlockedSolverMessage('wasm 里找不到 metadata.invoke 对应的 export "f"')).toBe(true);
        expect(isBlockedSolverMessage('tests[0]: expected 1, got 0')).toBe(false);
    });
});
