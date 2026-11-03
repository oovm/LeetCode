/**
 * 隔离判题的端到端正反测试（真实子进程）。
 *
 * 正例：超 i64 输入在 TS 用例里以 bigint 承载，Node / Bun / Python 三条 lane 判题通过。
 * 反例：缺用例 / schema 不合法 / number 承载大整数 / 解法进程异常退出，全部结构化失败。
 */
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { bunRunnerReady } from '../src/adapters/typescript-bun/bridge.ts';
import { CONFORMANCE_ROOT } from '../src/domain/paths.ts';
import { runIsolatedJudge } from '../src/isolated/judge.ts';

const FIXTURES = join(CONFORMANCE_ROOT, 'tests', 'fixtures', 'isolated');
const FAST = { iterations: 2, warmup: 1 } as const;

describe('isolated judge 正例：bigint 用例跨运行时判题', () => {
    it('node 子进程：超 i64 输入按 bigint 判题通过', async () => {
        const result = await runIsolatedJudge({ problemDir: join(FIXTURES, 'bigint-echo'), lane: 'typescript', ...FAST });
        expect(result.ok).toBe(true);
        expect(result.executed).toBe(4);
        expect(result.passed).toBe(4);
        expect(result.runtimeMs).not.toBeNull();
        expect(result.casesSource.endsWith('bigint-echo.cases.ts')).toBe(true);
    }, 60_000);

    it.skipIf(!bunRunnerReady())('bun 子进程：同一解法、同一协议、同一计时口径判题通过', async () => {
        const result = await runIsolatedJudge({ problemDir: join(FIXTURES, 'bigint-echo'), lane: 'typescript-bun', ...FAST });
        expect(result.ok).toBe(true);
        expect(result.executed).toBe(4);
        expect(result.passed).toBe(4);
        expect(result.runtimeMs).not.toBeNull();
    }, 60_000);

    it('python 子进程：bigint 经 tagged 协议映射为 int，判题通过', async () => {
        const result = await runIsolatedJudge({ problemDir: join(FIXTURES, 'bigint-echo'), lane: 'python', ...FAST });
        expect(result.ok).toBe(true);
        expect(result.executed).toBe(4);
        expect(result.passed).toBe(4);
    }, 60_000);
});

describe('isolated judge 反例：全部结构化失败', () => {
    it('number 承载超安全整数 → unsafe_number', async () => {
        const result = await runIsolatedJudge({ problemDir: join(FIXTURES, 'unsafe-number'), lane: 'typescript', ...FAST });
        expect(result.ok).toBe(false);
        expect(result.failureKind).toBe('unsafe_number');
    }, 60_000);

    it('用例 schema 不合法 → cases_schema', async () => {
        const result = await runIsolatedJudge({ problemDir: join(FIXTURES, 'bad-schema'), lane: 'typescript', ...FAST });
        expect(result.ok).toBe(false);
        expect(result.failureKind).toBe('cases_schema');
    }, 60_000);

    it('缺用例 → cases_missing', async () => {
        const result = await runIsolatedJudge({ problemDir: join(FIXTURES, 'missing-cases'), lane: 'typescript', ...FAST });
        expect(result.ok).toBe(false);
        expect(result.failureKind).toBe('cases_missing');
    }, 60_000);

    it('解法进程装载期异常退出 → solver_exit', async () => {
        const result = await runIsolatedJudge({ problemDir: join(FIXTURES, 'crash-at-load'), lane: 'typescript', ...FAST });
        expect(result.ok).toBe(false);
        expect(result.failureKind).toBe('solver_exit');
        expect(result.executed).toBe(0);
    }, 60_000);
});
