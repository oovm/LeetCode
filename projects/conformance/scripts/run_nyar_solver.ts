#!/usr/bin/env node
/** ???? legion nyar ?????? metadata.tests ??? nyar-vm invoke?? */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { isArtifactCacheFreshForBuild } from '@nyar/valkyrie';

import { readNyarExecutionPinFromEnv } from '../src/adapters/shared/execution-pin.ts';
import {
    extractTestFailureIndex,
    formatSolverResultLine,
    type SolverCaseStats,
} from '../src/adapters/shared/solver-case-stats.ts';
import { assertTestCase, normalizeTsTestResult } from '../src/domain/assert.ts';
import { valkyrieProjectDir } from '../src/catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../src/domain/paths.ts';
import {
    ensureNyarBuild,
    loadMetadata,
    locateNyarVmBinary,
    resolveNyarBuildArtifacts,
    nyarInvokeBlockedReason,
    type NyarVmArtifacts,
} from '../src/adapters/valkyrie-nyar/ref.ts';
import { resolveWasmExportSymbol } from '../src/adapters/valkyrie-node/ref.ts';

function runNyarExport(nyarPath: string, exportName: string, args: Record<string, unknown>): unknown {
    const binary = locateNyarVmBinary();
    if (!binary) {
        throw new Error('nyar-vm ¦Ä???');
    }
    const argsJson = JSON.stringify(Object.values(args));
    const result = spawnSync(
        binary,
        ['run', nyarPath, '--entry', exportName, '--json', '--args-json', argsJson],
        { encoding: 'utf8' },
    );
    if (result.status !== 0) {
        throw new Error(`${result.stderr ?? ''}${result.stdout ?? ''}`.trim() || 'nyar-vm run failed');
    }
    const text = (result.stdout ?? '').trim();
    return JSON.parse(text);
}

function emitStats(stats: SolverCaseStats): void {
    console.log(formatSolverResultLine(stats));
}

async function main(): Promise<number> {
    const problemDir = process.argv[2];
    if (!problemDir) {
        console.error('usage: run_nyar_solver.ts <problem-dir>');
        return 2;
    }

    const meta = JSON.parse(readFileSync(join(problemDir, 'metadata.json'), 'utf8')) as { id?: string };
    const slug = meta.id;
    if (!slug) {
        throw new Error('metadata.id ??');
    }

    const problem = { id: slug };
    const projectDir = valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);

    let artifacts: NyarVmArtifacts | null = null;
    const pinned = readNyarExecutionPinFromEnv();
    if (pinned) {
        const freshness = isArtifactCacheFreshForBuild(pinned.artifactDir);
        if (!freshness.fresh) {
            throw new Error(freshness.reason ?? 'pinned execution manifest stale');
        }
        artifacts = {
            outDir: pinned.artifactDir,
            nyarPath: pinned.nyarPath,
            physicalEntry: pinned.physicalEntry,
            logicalEntry: pinned.logicalEntry,
        };
    } else {
        const buildOutcome = ensureNyarBuild(problem, projectDir);
        if (buildOutcome.error) {
            throw new Error(buildOutcome.error);
        }
        artifacts = resolveNyarBuildArtifacts(problem);
    }
    if (!artifacts) {
        throw new Error('¦Ä??? legion build --target nyar ????');
    }

    const { tests, invoke } = loadMetadata(problemDir);
    const entry = invoke.valkyrie ?? invoke.typescript;
    if (!entry) {
        throw new Error('metadata.invoke ??');
    }
    const exportName = resolveWasmExportSymbol(entry);
    const blocked = nyarInvokeBlockedReason(artifacts.nyarPath, entry);
    if (blocked) {
        throw new Error(blocked);
    }

    let pass = 0;
    for (const [index, case_] of tests.entries()) {
        try {
            if (typeof case_.expected === 'string' && case_.expected.startsWith('Error:')) {
                assertTestCase(index, case_.expected, () => {
                    void runNyarExport(artifacts.nyarPath, exportName, case_.args);
                });
            } else {
                const actual = normalizeTsTestResult(runNyarExport(artifacts.nyarPath, exportName, case_.args));
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
