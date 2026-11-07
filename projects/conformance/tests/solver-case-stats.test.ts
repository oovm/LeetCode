import { describe, expect, it } from 'vitest';

import {
    classifyMatrixOutcome,
    collectUnverifiedReasons,
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
            skipped: 0,
            skipped_timeout: 0,
            skipped_integer_argument: 0,
            firstFailureIndex: null,
            firstFailure: null,
        };
        const parsed = parseSolverResultLine(`noise\n${formatSolverResultLine(stats)}\n`);
        expect(parsed).toEqual(stats);
    });

    it('parses skipped count separately from pass/fail', () => {
        const stats = {
            ok: true,
            testCaseTotal: 3,
            executed_pass: 0,
            executed_fail: 0,
            blocked: 0,
            not_run: 2,
            skipped: 1,
            firstFailureIndex: null,
            firstFailure: null,
        };
        expect(parseSolverResultLine(formatSolverResultLine(stats))?.skipped).toBe(1);
        const legacy = formatSolverResultLine({ ...stats, skipped: undefined });
        expect(parseSolverResultLine(legacy)?.skipped).toBe(0);
    });

    it('parses first failure index from error text', () => {
        expect(extractTestFailureIndex('tests[2]: expected 1, got 0')).toBe(2);
        expect(extractTestFailureIndex('unrelated')).toBeNull();
        expect(emptySolverCaseStats('blocked').firstFailure).toBe('blocked');
    });

    it('parses skipped reason counts separately', () => {
        const stats = {
            ok: true,
            testCaseTotal: 4,
            executed_pass: 1,
            executed_fail: 0,
            blocked: 0,
            not_run: 0,
            skipped: 3,
            skipped_timeout: 1,
            skipped_integer_argument: 2,
            firstFailureIndex: null,
            firstFailure: null,
        };
        const parsed = parseSolverResultLine(formatSolverResultLine(stats));
        expect(parsed?.skipped_timeout).toBe(1);
        expect(parsed?.skipped_integer_argument).toBe(2);
        const legacy = parseSolverResultLine(
            formatSolverResultLine({ ...stats, skipped_timeout: undefined, skipped_integer_argument: undefined }),
        );
        expect(legacy?.skipped).toBe(3);
        expect(legacy?.skipped_timeout).toBe(0);
        expect(legacy?.skipped_integer_argument).toBe(0);
    });

    it('classifies green, red and unverified without counting unverified as failure', () => {
        const unverified = {
            green: false,
            buildStatus: 0,
            manifestFresh: true,
            testCaseTotal: 81,
            executed_pass: 78,
            executed_fail: 0,
            blocked: 0,
            not_run: 0,
            skipped: 3,
            skipped_timeout: 3,
            skipped_integer_argument: 0,
        };
        expect(classifyMatrixOutcome(unverified)).toBe('unverified');
        expect(collectUnverifiedReasons(unverified)).toEqual(['timeout']);
        // 有真实断言失败时是红，不是未验证。
        expect(classifyMatrixOutcome({ ...unverified, executed_pass: 77, executed_fail: 1, not_run: 1 })).toBe('red');
        // 全部用例真实通过才是绿。
        expect(classifyMatrixOutcome({ ...unverified, executed_pass: 81, skipped: 0, skipped_timeout: 0, green: true })).toBe('green');
        // build 失败没有可验证对象，是红；blocked 也不能把它洗成未验证。
        expect(classifyMatrixOutcome({ ...unverified, buildStatus: 1, executed_pass: 0, blocked: 81, skipped: 0 })).toBe('red');
    });

    it('lists integer ABI skips as an unverified reason', () => {
        const row = {
            green: false,
            buildStatus: 0,
            manifestFresh: true,
            testCaseTotal: 10,
            executed_pass: 8,
            executed_fail: 0,
            blocked: 0,
            not_run: 0,
            skipped: 2,
            skipped_timeout: 0,
            skipped_integer_argument: 2,
        };
        expect(collectUnverifiedReasons(row)).toEqual(['integer-abi']);
    });

    it('classifies infrastructure blocks separately from executed failures', () => {
        expect(isBlockedSolverMessage('Error: [wasm-js-glue] Cannot marshal schema kind "NamedAggregate"')).toBe(true);
        expect(isBlockedSolverMessage('Error: [wasm-js-glue] Cannot demarshal NamedAggregate "ArrayList"')).toBe(true);
        expect(isBlockedSolverMessage('wasm 里找不到 metadata.invoke 对应的 export "f"')).toBe(true);
        expect(isBlockedSolverMessage('tests[0]: expected 1, got 0')).toBe(false);
    });
});
