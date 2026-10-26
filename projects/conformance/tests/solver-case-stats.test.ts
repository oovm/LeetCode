import { describe, expect, it } from 'vitest';

import {
    emptySolverCaseStats,
    extractTestFailureIndex,
    formatSolverResultLine,
    parseSolverResultLine,
} from '../src/adapters/shared/solver-case-stats.ts';

describe('solver case stats marker', () => {
    it('round-trips marker line', () => {
        const stats = {
            ok: true,
            testCaseTotal: 3,
            testCasePass: 3,
            testCaseFail: 0,
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
});
