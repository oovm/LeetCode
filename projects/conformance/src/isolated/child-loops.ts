/**
 * 解法子进程的执行循环：所有运行时（Node / Bun / Python / V wasm 宿主）共用同一计时口径。
 *
 * 口径定义（与现有 in-process bench 的差异：断言已上移到判题进程，计时只含解法调用）：
 * 1. `warmup` 次全量用例循环，结果丢弃（JIT/解释器预热，不计时）。
 * 2. `iterations` 次全量用例循环，每次循环用单调时钟（`performance.now()`）计一遍耗时。
 * 3. 最后一次收集循环（不计时）逐用例取回返回值，编码为协议值交给判题进程比对。
 *
 * 解法返回值若含越过安全整数的 `number` 或非有限浮点，`encodeValue` 抛错并记为该用例失败，
 * 不在协议边界静默降级。
 */
import { decodeValue, encodeValue, type CaseOutcome, type RunCase } from './protocol.ts';
import type { Candidate } from './ts-entry.ts';

export type RunPlan = { warmup: number; iterations: number; cases: RunCase[] };

export type RunOutcome = { results: CaseOutcome[]; samples: number[]; collectMs: number };

function errorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

export async function executeRun(candidate: Candidate, plan: RunPlan): Promise<RunOutcome> {
    const decoded = plan.cases.map((entry) => ({
        index: entry.index,
        args: decodeValue(entry.args, `cases[${entry.index}].args`) as Record<string, unknown>,
    }));

    const loopAll = async (): Promise<void> => {
        for (const entry of decoded) {
            await candidate(entry.args);
        }
    };

    for (let round = 0; round < plan.warmup; round++) {
        await loopAll();
    }

    const samples: number[] = [];
    for (let round = 0; round < plan.iterations; round++) {
        const start = performance.now();
        await loopAll();
        samples.push(performance.now() - start);
    }

    const collectStart = performance.now();
    const results: CaseOutcome[] = [];
    for (const entry of decoded) {
        try {
            const value = await candidate(entry.args);
            results.push({ index: entry.index, ok: true, value: encodeValue(value, `cases[${entry.index}].result`) });
        } catch (err) {
            results.push({ index: entry.index, ok: false, error: errorMessage(err) });
        }
    }
    return { results, samples, collectMs: performance.now() - collectStart };
}
