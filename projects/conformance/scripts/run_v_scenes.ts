#!/usr/bin/env node
/**
 * 语言场景探针运行器：构建 `projects/conformance/scenes/<id>` 的 legion 工程，
 * 按 `scene.json` 调用 wasm 导出并把结果与期望值比对。
 *
 * 只吃「语法/语义写法是否成立」的证据，不迁就编译器现状：构建或调用失败都按
 * 缺口记录到 `reports/valkyrie-language-probe-ledger.md`，不改场景源码。
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { resolveCompileTargetPlan } from '../src/adapters/shared/compile-target-plan.ts';
import { loadLibraryInvokeSchema } from '../src/adapters/valkyrie-node/abi.ts';
import { ensureVBuild, resolveVBuildArtifacts } from '../src/adapters/valkyrie-node/ref.ts';
import { normalizeTsTestResult } from '../src/domain/assert.ts';
import { formatValue, resultsMatch } from '../src/domain/compare-mode.ts';
import { CONFORMANCE_ROOT } from '../src/domain/paths.ts';
import type { ProblemDefinition } from '../src/domain/problem.ts';
import { normalizeResultByAbiType } from '../src/isolated/v-shared.ts';

type SceneCase = { export: string; expected: unknown; note?: string };
type SceneManifest = { id: string; cases: SceneCase[] };
type InvokeHost = { callExport?: (name: string, ...args: unknown[]) => unknown };

const SCENES_ROOT = join(CONFORMANCE_ROOT, 'scenes');

async function loadHost(mjsPath: string): Promise<InvokeHost> {
    return (await import(pathToFileURL(mjsPath).href)) as InvokeHost;
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

async function runScene(dir: string): Promise<{ pass: number; fail: number; total: number; lines: string[] }> {
    const manifest = JSON.parse(readFileSync(join(dir, 'scene.json'), 'utf8')) as SceneManifest;
    const lines: string[] = [];
    const built = buildScene(dir, manifest.id);
    if ('error' in built) {
        lines.push(`  BUILD-FAIL ${manifest.id}: ${built.error.split('\n')[0]}`);
        return { pass: 0, fail: manifest.cases.length, total: manifest.cases.length, lines };
    }

    const host = await loadHost(built.mjs);
    if (typeof host.callExport !== 'function') {
        lines.push(`  CALL-FAIL ${manifest.id}: node glue 未暴露 callExport`);
        return { pass: 0, fail: manifest.cases.length, total: manifest.cases.length, lines };
    }
    const schema = loadLibraryInvokeSchema(readFileSync(built.wasm));

    let pass = 0;
    let fail = 0;
    for (const testCase of manifest.cases) {
        const exportSchema = schema.exports[testCase.export];
        if (!exportSchema) {
            fail += 1;
            lines.push(`  CASE-FAIL ${manifest.id}::${testCase.export}: ABI schema 里没有该导出`);
            continue;
        }
        try {
            const raw = await host.callExport(testCase.export);
            const returns = exportSchema.returns;
            const actual = normalizeResultByAbiType(normalizeTsTestResult(raw), returns);
            if (testCase.expected === 'trap') {
                fail += 1;
                lines.push(`  CASE-FAIL ${manifest.id}::${testCase.export}: expected trap, got ${formatValue(actual)}`);
                continue;
            }
            const expected = normalizeResultByAbiType(normalizeTsTestResult(testCase.expected), returns);
            if (resultsMatch(actual, expected, 'strict')) {
                pass += 1;
                lines.push(`  PASS ${manifest.id}::${testCase.export}`);
            } else {
                fail += 1;
                lines.push(
                    `  CASE-FAIL ${manifest.id}::${testCase.export}: expected ${formatValue(expected)}, got ${formatValue(actual)}`,
                );
            }
        } catch (err) {
            if (testCase.expected === 'trap') {
                pass += 1;
                lines.push(`  PASS ${manifest.id}::${testCase.export}: trapped as expected`);
                continue;
            }
            fail += 1;
            lines.push(`  CASE-FAIL ${manifest.id}::${testCase.export}: ${String(err).split('\n')[0]}`);
        }
    }
    return { pass, fail, total: manifest.cases.length, lines };
}

async function main(): Promise<number> {
    const dirs = sceneDirs(process.argv.slice(2));
    if (dirs.length === 0) {
        console.error('未发现带 scene.json 的场景目录');
        return 2;
    }
    let pass = 0;
    let fail = 0;
    let total = 0;
    for (const dir of dirs) {
        const result = await runScene(dir);
        for (const line of result.lines) {
            console.log(line);
        }
        pass += result.pass;
        fail += result.fail;
        total += result.total;
    }
    console.log(`scenes: ${dirs.length}, cases: ${total}, pass: ${pass}, fail: ${fail}`);
    return fail === 0 ? 0 : 1;
}

main().then((code) => process.exit(code));
