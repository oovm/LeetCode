import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { resolveArtifactDir } from '@valkyrie-language/vcc/testing';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir, valkyrieProjectDir } from '../../catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import { resolveWasmExportSymbol } from '../valkyrie-node/ref.ts';
import { loadMetadata, type TestCase } from '../valkyrie-node/ref.ts';
import { locateNyarVmBinary, valkyrieNyarRunnerReady } from './valkyrie.ts';

/** 与 `CanonicalTarget` 显示字符串一致。 */
export const NYAR_VM_TARGET = 'nyar-unknown-unknown-managed';

const RUN_NYAR_SOLVER = join(LEETCODE_ROOT_FROM_PACKAGE, 'projects', 'conformance', 'scripts', 'run_nyar_solver.ts');

export function nyarBuildDir(problem: ProblemDefinition): string {
    return join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-nyar`);
}

export type NyarVmArtifacts = {
    outDir: string;
    nyarPath: string;
    physicalEntry: string;
    logicalEntry: string;
};

function readContractField(contractPath: string, field: 'physical_entry' | 'logical_entry'): string | null {
    try {
        const text = readFileSync(contractPath, 'utf8');
        const match = text.match(new RegExp(`${field}\\s*:\\s*"([^"]+)"`));
        return match?.[1] ?? null;
    } catch {
        return null;
    }
}

/** 解析 `legion build --target nyar` 产物中的 `.nyar` 与 run-contract 入口。 */
export function resolveNyarBuildArtifacts(problem: ProblemDefinition): NyarVmArtifacts | null {
    const outDir = resolveArtifactDir(nyarBuildDir(problem), NYAR_VM_TARGET);
    for (const contractName of ['run-contracts.txt', 'run-contract.txt']) {
        const contractPath = join(outDir, contractName);
        const physical = readContractField(contractPath, 'physical_entry');
        if (!physical?.endsWith('.nyar')) {
            continue;
        }
        const nyarPath = join(outDir, physical);
        try {
            readFileSync(nyarPath);
        } catch {
            continue;
        }
        const logicalEntry = readContractField(contractPath, 'logical_entry') ?? 'main';
        return { outDir, nyarPath, physicalEntry: physical, logicalEntry };
    }
    return null;
}

/** 列出 `.nyar` 导出符号（`nyar-vm list`）。 */
export function listNyarExports(nyarPath: string): string[] {
    const binary = locateNyarVmBinary();
    if (!binary) {
        return [];
    }
    const result = spawnSync(binary, ['list', nyarPath], { encoding: 'utf8' });
    const text = `${result.stdout ?? ''}${result.stderr ?? ''}`;
    return text
        .split(/\r?\n/)
        .map((line) => line.split('\t')[0]?.trim())
        .filter((name) => name.length > 0);
}

export function nyarInvokeBlockedReason(nyarPath: string, invokeEntry?: string): string | null {
    if (!valkyrieNyarRunnerReady()) {
        return 'legion 或 nyar-vm 未就绪';
    }
    const exports = listNyarExports(nyarPath);
    if (exports.length === 0) {
        return '`.nyar` 模块无导出或 nyar-vm list 失败';
    }
    if (invokeEntry) {
        const expected = resolveWasmExportSymbol(invokeEntry);
        if (!exports.includes(expected)) {
            return `.nyar 缺少 metadata.invoke 声明的导出 ${expected}（现有：${exports.join(', ') || '无'}）`;
        }
    }
    return null;
}

export async function runNyarSolverOnce(problemRoot: string): Promise<void> {
    const blocked = (() => {
        try {
            const slug = JSON.parse(readFileSync(join(problemRoot, 'metadata.json'), 'utf8')).id as string;
            const artifacts = resolveNyarBuildArtifacts({ id: slug } as ProblemDefinition);
            if (!artifacts) {
                return '未找到 legion build --target nyar 产物';
            }
            const { tests, invoke } = loadMetadata(problemRoot);
            const entry = invoke.valkyrie ?? invoke.typescript;
            if (!entry) {
                return 'metadata.invoke 缺失';
            }
            if (tests.length === 0) {
                return 'metadata.tests 为空';
            }
            return nyarInvokeBlockedReason(artifacts.nyarPath, entry);
        } catch (err) {
            return String(err);
        }
    })();
    if (blocked) {
        throw new Error(blocked);
    }

    const result = spawnSync(process.execPath, ['--import', 'tsx', RUN_NYAR_SOLVER, problemRoot], {
        encoding: 'utf8',
        cwd: join(LEETCODE_ROOT_FROM_PACKAGE, 'projects', 'conformance'),
        env: {
            ...process.env,
            NYAR_VM: locateNyarVmBinary() ?? '',
        },
    });
    const stderr = `${result.stderr ?? ''}${result.stdout ?? ''}`.trim();
    if (result.status !== 0) {
        throw new Error(stderr || 'run_nyar_solver failed');
    }
}

export async function runNyarReference(problem: ProblemDefinition): Promise<{ ok: boolean; stderr: string }> {
    const root = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    try {
        await runNyarSolverOnce(root);
        return { ok: true, stderr: '' };
    } catch (err) {
        return { ok: false, stderr: String(err) };
    }
}

export { locateNyarVmBinary } from './valkyrie.ts';
export { loadMetadata, type TestCase } from '../valkyrie-node/ref.ts';
