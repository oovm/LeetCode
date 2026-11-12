#!/usr/bin/env node
/** ���� solvers/wolfram-sxo/solution.wl ���� @sxo/mathematica ִ�� cases 用例�� */
import { SXO_BENCH_PARAMS } from '../src/planning/bench-params.ts';
import { benchWolframSxoSolverInProcess, runWolframSxoSolverOnce } from '../src/adapters/wolfram-sxo/ref.ts';
import { sxoRunnerReady, sxoSkipReason } from '../src/adapters/shared/sxo-bridge.ts';

async function main(): Promise<number> {
    const args = process.argv.slice(2);
    const benchMode = args[0] === '--bench';
    const problemDir = benchMode ? args[1] : args[0];
    if (!problemDir) {
        console.error('usage: run_wolfram_sxo_solver.ts <problem-dir>');
        console.error('       run_wolfram_sxo_solver.ts --bench <problem-dir>');
        return 2;
    }

    if (!sxoRunnerReady()) {
        console.error(sxoSkipReason() ?? '@sxo/mathematica δ��װ');
        return 2;
    }

    if (benchMode) {
        const runtimeMs = await benchWolframSxoSolverInProcess(problemDir, SXO_BENCH_PARAMS.iterations, SXO_BENCH_PARAMS.warmup);
        console.log(JSON.stringify({ runtimeMs }));
        return 0;
    }

    await runWolframSxoSolverOnce(problemDir);
    return 0;
}

main().catch((err) => {
    console.error(String(err));
    process.exit(1);
});
