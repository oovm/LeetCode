#!/usr/bin/env node
/** º”‘ÿ solvers/typescript/<project>/solution.ts ≤¢÷¥–– metadata.tests°£ */
import { benchTsSolverInProcess, runTsSolverOnce } from '../src/adapters/typescript-node/ref.ts';
import { TYPESCRIPT_BENCH_PARAMS } from '../src/planning/bench-params.ts';

async function main(): Promise<number> {
    const args = process.argv.slice(2);
    const benchMode = args[0] === '--bench';
    const problemDir = benchMode ? args[1] : args[0];
    if (!problemDir) {
        console.error('usage: run_ts_solver.ts <problem-dir>');
        console.error('       run_ts_solver.ts --bench <problem-dir>');
        return 2;
    }

    if (benchMode) {
        const runtimeMs = await benchTsSolverInProcess(problemDir, TYPESCRIPT_BENCH_PARAMS.iterations, TYPESCRIPT_BENCH_PARAMS.warmup);
        console.log(JSON.stringify({ runtimeMs }));
        return 0;
    }

    await runTsSolverOnce(problemDir);
    return 0;
}

main().catch((err) => {
    console.error(String(err));
    process.exit(1);
});
