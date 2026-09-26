#!/usr/bin/env node
/** 加载 legion nyar 产物并对 metadata.tests 执行 nyar-vm invoke。 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { assertTestCase, normalizeTsTestResult } from '../src/domain/assert.ts';
import {
    loadMetadata,
    locateNyarVmBinary,
    resolveNyarBuildArtifacts,
    nyarInvokeBlockedReason,
} from '../src/adapters/valkyrie-nyar/ref.ts';
import { resolveWasmExportSymbol } from '../src/adapters/valkyrie-node/ref.ts';

function runNyarExport(nyarPath: string, exportName: string, args: Record<string, unknown>): unknown {
    const binary = locateNyarVmBinary();
    if (!binary) {
        throw new Error('nyar-vm 未找到');
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

async function main(): Promise<number> {
    const problemDir = process.argv[2];
    if (!problemDir) {
        console.error('usage: run_nyar_solver.ts <problem-dir>');
        return 2;
    }

    const meta = JSON.parse(readFileSync(join(problemDir, 'metadata.json'), 'utf8')) as { id?: string };
    const slug = meta.id;
    if (!slug) {
        throw new Error('metadata.id 缺失');
    }

    const artifacts = resolveNyarBuildArtifacts({ id: slug });
    if (!artifacts) {
        throw new Error('未找到 legion build --target nyar 产物');
    }

    const { tests, invoke } = loadMetadata(problemDir);
    const entry = invoke.valkyrie ?? invoke.typescript;
    if (!entry) {
        throw new Error('metadata.invoke 缺失');
    }
    const exportName = resolveWasmExportSymbol(entry);
    const blocked = nyarInvokeBlockedReason(artifacts.nyarPath, entry);
    if (blocked) {
        throw new Error(blocked);
    }

    for (const [index, case_] of tests.entries()) {
        if (typeof case_.expected === 'string' && case_.expected.startsWith('Error:')) {
            assertTestCase(index, case_.expected, () => {
                void runNyarExport(artifacts.nyarPath, exportName, case_.args);
            });
            continue;
        }
        const actual = normalizeTsTestResult(runNyarExport(artifacts.nyarPath, exportName, case_.args));
        const expected = normalizeTsTestResult(case_.expected);
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
    }
    return 0;
}

main().catch((err) => {
    console.error(String(err));
    process.exit(1);
});
