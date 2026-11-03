#!/usr/bin/env node
/** 隔离判题 CLI：判题器（本进程）与子进程解法经 NDJSON 协议通信，结果 JSON 打到 stdout。 */
import { runIsolatedJudge, type JudgeLane } from '../src/isolated/judge.ts';

function usage(): never {
    console.error(
        'usage: run_isolated_judge.ts <problem-dir> --lang <typescript|typescript-bun|python|valkyrie-wasm|valkyrie-ovm|valkyrie-jvm|valkyrie-clr>',
    );
    console.error('       [--cases <path>] [--artifact-dir <dir>] [--iterations N] [--warmup N] [--run-timeout-ms N]');
    process.exit(2);
}

async function main(): Promise<number> {
    const args = process.argv.slice(2);
    const problemDir = args[0];
    if (!problemDir || problemDir.startsWith('--')) {
        usage();
    }
    const flag = (name: string): string | undefined => {
        const index = args.indexOf(name);
        return index >= 0 ? args[index + 1] : undefined;
    };
    const lane = flag('--lang') as JudgeLane | undefined;
    const lanes: JudgeLane[] = ['typescript', 'typescript-bun', 'python', 'valkyrie-wasm', 'valkyrie-ovm', 'valkyrie-jvm', 'valkyrie-clr'];
    if (!lane || !lanes.includes(lane)) {
        usage();
    }
    const result = await runIsolatedJudge({
        problemDir,
        lane,
        casesPath: flag('--cases'),
        artifactDir: flag('--artifact-dir'),
        iterations: flag('--iterations') ? Number(flag('--iterations')) : undefined,
        warmup: flag('--warmup') ? Number(flag('--warmup')) : undefined,
        runTimeoutMs: flag('--run-timeout-ms') ? Number(flag('--run-timeout-ms')) : undefined,
    });
    console.log(JSON.stringify(result));
    return result.ok ? 0 : 1;
}

main().catch((err) => {
    console.error(String(err));
    process.exit(1);
});
