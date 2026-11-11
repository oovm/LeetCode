#!/usr/bin/env node
/**
 * 语言场景探针运行器：构建 `projects/conformance/scenes/<id>` 的 legion 工程，
 * 按 `scene.json` 调用 wasm 导出并把结果与期望值比对。
 *
 * 只吃「语法/语义写法是否成立」的证据，不迁就编译器现状：构建或调用失败都按
 * 缺口记录到 `reports/valkyrie-language-probe-ledger.md`，不改场景源码。
 *
 * 观测口径（[01 §4.12] 工具链身份门与验收观察门）：
 * - build / marshal / guest invoke / demarshal-normalize 分阶段独立报告。
 * - 预期 trap 只接受明确的 guest trap 类型与原因；宿主侧异常永不判为通过。
 * - 每条结果携带稳定 case identity 与内容摘要，逐例状态来自本例真实观测。
 * - 报告头携带 native addon 身份（路径 + sha256 + mtime）；身份与源码提交
 *   不可比时不得据此归因源码。
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { resolveCompileTargetPlan } from '../src/adapters/shared/compile-target-plan.ts';
import { loadLibraryInvokeSchema } from '../src/adapters/valkyrie-node/abi.ts';
import { ensureVBuild, resolveVBuildArtifacts } from '../src/adapters/valkyrie-node/ref.ts';
import { CONFORMANCE_ROOT } from '../src/domain/paths.ts';
import type { ProblemDefinition } from '../src/domain/problem.ts';
import { sceneCaseDigest, sceneCaseId } from '../src/observation/case-identity.ts';
import { formatSceneCaseLine, runSceneCase, type SceneCase, type SceneCaseResult, type SceneInvokeHost } from '../src/observation/scene-verify.ts';
import { formatAddonIdentity, resolveAddonIdentity, type AddonIdentity } from '../src/observation/toolchain-identity.ts';

type SceneManifest = { id: string; cases: SceneCase[] };

const SCENES_ROOT = join(CONFORMANCE_ROOT, 'scenes');

async function loadHost(mjsPath: string): Promise<SceneInvokeHost> {
    return (await import(pathToFileURL(mjsPath).href)) as SceneInvokeHost;
}

function sceneDirs(argv: string[]): string[] {
    if (argv.length > 0) {
        return argv.map((dir) => join(SCENES_ROOT, dir));
    }
    return readdirSync(SCENES_ROOT, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => join(SCENES_ROOT, entry.name))
        .filter((dir) => existsSync(join(dir, 'scene.json')))
        .sort();
}

/** 构建一个场景，失败时返回缺口文本而不是抛异常，保持其余场景继续跑。 */
function buildScene(dir: string, id: string): { error: string } | { mjs: string; wasm: string } {
    try {
        const plan = resolveCompileTargetPlan(dir);
        const problem = { id } as ProblemDefinition;
        const outcome = ensureVBuild(problem, plan);
        if (outcome.error) {
            return { error: outcome.error };
        }
        const artifacts = outcome.artifacts ?? resolveVBuildArtifacts(problem);
        if (!artifacts) {
            return { error: 'legion build 未产出可执行产物' };
        }
        return { mjs: artifacts.entry.legionMjs, wasm: artifacts.entry.legionWasm };
    } catch (err) {
        return { error: String(err) };
    }
}

/** build 阶段失败时逐例显式落账（skipped 相位 + 同一原因），不从计数倒推。 */
function buildFailedResults(manifest: SceneManifest, reason: string): SceneCaseResult[] {
    return manifest.cases.map((testCase) => ({
        caseId: sceneCaseId(manifest.id, testCase.export),
        caseDigest: sceneCaseDigest(testCase),
        verdict: 'fail' as const,
        failure: `phase=build: ${reason.split('\n')[0]}`,
        phases: {
            marshal: { status: 'skipped' as const },
            invoke: { status: 'skipped' as const },
            demarshal: { status: 'skipped' as const },
        },
    }));
}

type SceneReport = {
    id: string;
    build: { status: 'ok' | 'failed'; error: string | null };
    cases: SceneCaseResult[];
};

async function runScene(dir: string): Promise<SceneReport> {
    const manifest = JSON.parse(readFileSync(join(dir, 'scene.json'), 'utf8')) as SceneManifest;
    const built = buildScene(dir, manifest.id);
    if ('error' in built) {
        return { id: manifest.id, build: { status: 'failed', error: built.error }, cases: buildFailedResults(manifest, built.error) };
    }

    const host = await loadHost(built.mjs);
    if (typeof host.callExport !== 'function') {
        const reason = 'node glue 未暴露 callExport';
        return { id: manifest.id, build: { status: 'failed', error: reason }, cases: buildFailedResults(manifest, reason) };
    }
    const schema = loadLibraryInvokeSchema(readFileSync(built.wasm));

    const cases: SceneCaseResult[] = [];
    for (const testCase of manifest.cases) {
        cases.push(await runSceneCase(host, schema, manifest.id, testCase));
    }
    return { id: manifest.id, build: { status: 'ok', error: null }, cases };
}

function parseArgs(argv: string[]): { jsonOut: string | null; sceneNames: string[] } {
    const sceneNames: string[] = [];
    let jsonOut: string | null = null;
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index]!;
        if (arg === '--json') {
            const path = argv[index + 1];
            if (path === undefined) {
                console.error('--json 需要一个输出路径');
                process.exit(2);
            }
            jsonOut = path;
            index += 1;
        } else {
            sceneNames.push(arg);
        }
    }
    return { jsonOut, sceneNames };
}

async function main(): Promise<number> {
    const { jsonOut, sceneNames } = parseArgs(process.argv.slice(2));
    const dirs = sceneDirs(sceneNames);
    if (dirs.length === 0) {
        console.error('未发现带 scene.json 的场景目录');
        return 2;
    }
    const addon: AddonIdentity = resolveAddonIdentity();
    console.log(`TOOLCHAIN ${formatAddonIdentity(addon)}`);

    const reports: SceneReport[] = [];
    let pass = 0;
    let fail = 0;
    let total = 0;
    for (const dir of dirs) {
        const report = await runScene(dir);
        for (const result of report.cases) {
            console.log(formatSceneCaseLine(result));
            total += 1;
            if (result.verdict === 'pass') {
                pass += 1;
            } else {
                fail += 1;
            }
        }
        reports.push(report);
    }
    console.log(`scenes: ${dirs.length}, cases: ${total}, pass: ${pass}, fail: ${fail}`);
    console.log(`TOOLCHAIN ${formatAddonIdentity(addon)}`);

    if (jsonOut !== null) {
        writeFileSync(
            jsonOut,
            `${JSON.stringify({ generatedAt: new Date().toISOString(), addon, scenes: reports, totals: { scenes: dirs.length, cases: total, pass, fail } }, null, 4)}\n`,
            'utf8',
        );
        console.log(`json report: ${jsonOut}`);
    }
    return fail === 0 ? 0 : 1;
}

main().then((code) => process.exit(code));
