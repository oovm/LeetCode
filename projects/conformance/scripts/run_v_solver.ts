#!/usr/bin/env node
/** ???? legion node ?????? metadata.tests ????? wasm invoke???? glue ??????? */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { isArtifactCacheFresh, NODE_WASM_TARGET } from '@nyar/valkyrie';

import { readNodeExecutionPinFromEnv } from '../src/adapters/shared/execution-pin.ts';
import {
    extractTestFailureIndex,
    formatSolverResultLine,
    type SolverCaseStats,
} from '../src/adapters/shared/solver-case-stats.ts';
import { assertTestCase, normalizeTsTestResult } from '../src/domain/assert.ts';
import {
    ensureVBuild,
    loadMetadata,
    resolveVBuildArtifacts,
    resolveWasmExportSymbol,
    type VBuildArtifacts,
    wasmInvokeBlockedReason,
} from '../src/adapters/valkyrie-node/ref.ts';
import { valkyrieProjectDir } from '../src/catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../src/domain/paths.ts';

type InvokeHost = {
    invokeLeetCode?: (entry: string, args: Record<string, unknown>) => unknown;
    callExport?: (name: string, ...args: unknown[]) => unknown;
};

async function loadInvokeHost(mjsPath: string): Promise<InvokeHost> {
    return (await import(pathToFileURL(mjsPath).href)) as InvokeHost;
}

async function runCandidate(host: InvokeHost, entry: string, args: Record<string, unknown>): Promise<unknown> {
    if (typeof host.invokeLeetCode === 'function') {
        return host.invokeLeetCode(entry, args);
    }
    if (typeof host.callExport === 'function') {
        const exportSymbol = resolveWasmExportSymbol(entry);
        return host.callExport(exportSymbol, ...Object.values(args));
    }
    throw new Error('node glue ??? invokeLeetCode / callExport???? valkyrie.rs ? leetcode ???????? wasm invoke??');
}

function emitStats(stats: SolverCaseStats): void {
    console.log(formatSolverResultLine(stats));
}

async function main(): Promise<number> {
    const problemDir = process.argv[2];
    if (!problemDir) {
        console.error('usage: run_v_solver.ts <problem-dir>');
        return 2;
    }

    const meta = JSON.parse(readFileSync(join(problemDir, 'metadata.json'), 'utf8')) as {
        id?: string;
    };
    const slug = meta.id;
    if (!slug) {
        throw new Error('metadata.id ??');
    }

    const problem = { id: slug };
    const projectDir = valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);

    let artifacts: VBuildArtifacts | null = null;
    const pinned = readNodeExecutionPinFromEnv();
    if (pinned) {
        const freshness = isArtifactCacheFresh(pinned.artifactDir, NODE_WASM_TARGET);
        if (!freshness.fresh) {
            throw new Error(freshness.reason ?? 'pinned execution manifest stale');
        }
        artifacts = {
            outDir: pinned.artifactDir,
            entry: {
                legionMjs: pinned.legionMjs,
                legionWasm: pinned.legionWasm,
                physicalEntry: pinned.physicalEntry,
                legacy: false,
            },
        };
    } else {
        const buildOutcome = ensureVBuild(problem, projectDir);
        if (buildOutcome.error) {
            throw new Error(buildOutcome.error);
        }
        artifacts = buildOutcome.artifacts ?? resolveVBuildArtifacts(problem);
    }
    if (!artifacts) {
        throw new Error('¦Ä??? legion build ????');
    }

    const { tests, invoke } = loadMetadata(problemDir);
    const entry = invoke.valkyrie ?? invoke.typescript;
    const blocked = wasmInvokeBlockedReason(artifacts.entry.legionWasm, entry);
    if (blocked) {
        throw new Error(blocked);
    }
    if (!entry) {
        throw new Error('metadata.invoke ??');
    }

    const host = await loadInvokeHost(artifacts.entry.legionMjs);
    let pass = 0;
    for (const [index, case_] of tests.entries()) {
        try {
            if (typeof case_.expected === 'string' && case_.expected.startsWith('Error:')) {
                assertTestCase(index, case_.expected, () => {
                    void runCandidate(host, entry, case_.args);
                });
            } else {
                const actual = normalizeTsTestResult(await runCandidate(host, entry, case_.args));
                const expected = normalizeTsTestResult(case_.expected);
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
                }
            }
            pass += 1;
        } catch (err) {
            const message = String(err);
            emitStats({
                ok: false,
                testCaseTotal: tests.length,
                testCasePass: pass,
                testCaseFail: tests.length - pass,
                firstFailureIndex: extractTestFailureIndex(message) ?? index,
                firstFailure: message,
            });
            console.error(message);
            return 1;
        }
    }

    emitStats({
        ok: true,
        testCaseTotal: tests.length,
        testCasePass: pass,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: null,
    });
    return 0;
}

main().catch((err) => {
    const message = String(err);
    emitStats({
        ok: false,
        testCaseTotal: 0,
        testCasePass: 0,
        testCaseFail: 0,
        firstFailureIndex: extractTestFailureIndex(message),
        firstFailure: message,
    });
    console.error(message);
    process.exit(1);
});
