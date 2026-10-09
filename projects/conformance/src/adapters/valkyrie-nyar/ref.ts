import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { NYAR_VM_TARGET, resolveArtifactDir, resolveNyarEntry, isArtifactCacheFresh } from '@valkyrie-language/vcc/testing';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir, valkyrieProjectDir } from '../../catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import { resolveWasmExportSymbol } from '../valkyrie-node/ref.ts';
import { loadMetadata, type TestCase } from '../valkyrie-node/ref.ts';
import { formatLegionError, legionBuildNyar, locateNyarVmBinary, nyarBuildDir, valkyrieNyarRunnerReady } from './valkyrie.ts';

const RUN_NYAR_SOLVER = join(LEETCODE_ROOT_FROM_PACKAGE, 'projects', 'conformance', 'scripts', 'run_nyar_solver.ts');

export { nyarBuildDir } from './valkyrie.ts';

export type NyarVmArtifacts = {
    outDir: string;
    nyarPath: string;
    physicalEntry: string;
    logicalEntry: string;
};

export type NyarBuildOutcome = {
    error: string | null;
    artifacts: NyarVmArtifacts | null;
    buildRoute: string | null;
};

export type NyarReferencePin = {
    artifacts: NyarVmArtifacts;
    buildRoute: string | null;
};

/** 解析 `legion build --target nyar` 产物中的 `.nyar` 与 run-contract 入口。 */
export function resolveNyarBuildArtifacts(problem: ProblemDefinition): NyarVmArtifacts | null {
    const outDir = resolveArtifactDir(nyarBuildDir(problem), NYAR_VM_TARGET);
    const entry = resolveNyarEntry(outDir);
    if (!entry) {
        return null;
    }
    return {
        outDir,
        nyarPath: entry.nyarPath,
        physicalEntry: entry.physicalEntry,
        logicalEntry: entry.logicalEntry,
    };
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

/** 构建或复用带 execution manifest 校验的 Nyar 产物。 */
export function ensureNyarBuild(problem: ProblemDefinition, projectDir: string): NyarBuildOutcome {
    const outDir = nyarBuildDir(problem);
    const artifactDir = resolveArtifactDir(outDir, NYAR_VM_TARGET);
    const cached = resolveNyarBuildArtifacts(problem);
    const freshness = isArtifactCacheFresh(artifactDir, NYAR_VM_TARGET);
    if (cached && freshness.fresh) {
        return { error: null, artifacts: cached, buildRoute: null };
    }

    mkdirSync(outDir, { recursive: true });
    const build = legionBuildNyar(projectDir, outDir);
    if (build.status !== 0) {
        return {
            error: formatLegionError('legion build --target nyar', build),
            artifacts: null,
            buildRoute: build.route,
        };
    }

    const artifacts = resolveNyarBuildArtifacts(problem);
    if (!artifacts) {
        return {
            error: 'legion build --target nyar 完成但未找到 .nyar 产物',
            artifacts: null,
            buildRoute: build.route,
        };
    }

    const rebuiltFreshness = isArtifactCacheFresh(artifactDir, NYAR_VM_TARGET);
    if (!rebuiltFreshness.fresh) {
        return {
            error: rebuiltFreshness.reason ?? 'legion build 产物缺少可信 execution manifest',
            artifacts: null,
            buildRoute: build.route,
        };
    }

    return { error: null, artifacts, buildRoute: build.route };
}

export async function runNyarSolverOnce(problemRoot: string, pin?: NyarReferencePin): Promise<void> {
    const blocked = (() => {
        try {
            const slug = JSON.parse(readFileSync(join(problemRoot, 'metadata.json'), 'utf8')).id as string;
            const problem = { id: slug } as ProblemDefinition;
            const projectDir = join(problemRoot, 'solvers', 'valkyrie');
            const artifacts = pin?.artifacts ?? (() => {
                const build = ensureNyarBuild(problem, projectDir);
                if (build.error) {
                    throw new Error(build.error);
                }
                return build.artifacts;
            })();
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

export async function runNyarReference(problem: ProblemDefinition, pin?: NyarReferencePin): Promise<{ ok: boolean; stderr: string }> {
    const root = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    try {
        await runNyarSolverOnce(root, pin);
        return { ok: true, stderr: '' };
    } catch (err) {
        return { ok: false, stderr: String(err) };
    }
}

export { locateNyarVmBinary } from './valkyrie.ts';
export { loadMetadata, type TestCase } from '../valkyrie-node/ref.ts';
