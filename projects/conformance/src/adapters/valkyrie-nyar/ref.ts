import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
    legionInvokeOvmExport,
    legionListOvmExports,
    resolveArtifactDir,
    resolveNyarEntry,
} from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir, valkyrieProjectDir } from '../../catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import { readArtifactEvidence } from '../shared/artifact-evidence.ts';
import { resolveLaneTargetPlan, type CompileTargetPlan } from '../shared/compile-target-plan.ts';
import { encodeNyarExecutionPin } from '../shared/execution-pin.ts';
import { emptySolverCaseStats, parseSolverResultLine, type SolverCaseStats } from '../shared/solver-case-stats.ts';
import { loadMetadata, resolveWasmExportSymbol } from '../valkyrie-node/ref.ts';
import { formatLegionError, legionBuildNyar, NYAR_BUILD_TARGET, nyarBuildDir, valkyrieNyarRunnerReady } from './valkyrie.ts';

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
    /** 产物证据的期望 canonical triple（来自 `CompileTargetPlan`，禁止从 artifact 反推）。 */
    compileTarget: string;
};

/** 从 `legion build --target ovm` 的输出目录解析 `.nyar` 与 run-contract 入口。 */
export function resolveNyarBuildArtifacts(problem: ProblemDefinition): NyarVmArtifacts | null {
    const outDir = resolveArtifactDir(nyarBuildDir(problem), 'ovm');
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

/** 列出 OVM 产物的 `.nyar` 导出。 */
export function listNyarExports(nyarPath: string): string[] {
    if (!valkyrieNyarRunnerReady()) {
        return [];
    }
    try {
        return legionListOvmExports(nyarPath);
    } catch {
        return [];
    }
}

export function nyarInvokeBlockedReason(nyarPath: string, invokeEntry?: string): string | null {
    if (!valkyrieNyarRunnerReady()) {
        return 'Legion / @nyar/valkyrie N-API 未就绪';
    }
    const exports = listNyarExports(nyarPath);
    if (exports.length === 0) {
        return '`.nyar` 没有可导出符号，确认 legion build --target ovm 是否成功';
    }
    if (invokeEntry) {
        const expected = resolveWasmExportSymbol(invokeEntry);
        if (!exports.includes(expected)) {
            return `.nyar 里找不到 metadata.invoke 对应的 export "${expected}"（已有: ${exports.join(', ') || '(none)'}）`;
        }
    }
    return null;
}

/**
 * 读取 metadata 入口后判定 `.nyar` invoke 是否被阻塞；返回 `null` 表示可 invoke。
 */
export function resolveNyarInvokeBlocker(problemRoot: string, nyarPath: string): string | null {
    try {
        const { invoke } = loadMetadata(problemRoot);
        const entry = invoke.valkyrie ?? invoke.typescript;
        if (!entry) {
            return 'metadata.invoke 缺失';
        }
        return nyarInvokeBlockedReason(nyarPath, entry);
    } catch (error) {
        return String(error);
    }
}

/**
 * 用同一 lane 计划完成 `legion build --target ovm` + freshness 判定。
 *
 * 与 wasm lane 一致：每次都构建，freshness 的期望 target 来自计划对象而不是 artifact 自身。
 */
export function ensureNyarBuild(problem: ProblemDefinition, plan: CompileTargetPlan): NyarBuildOutcome {
    const outDir = nyarBuildDir(problem);
    const artifactDir = resolveArtifactDir(outDir, plan.canonicalTarget);
    mkdirSync(outDir, { recursive: true });

    const build = legionBuildNyar(plan, outDir);
    if (build.status !== 0) {
        return {
            error: formatLegionError(`legion build --target ${plan.canonicalTarget}`, build),
            artifacts: null,
            buildRoute: build.route,
        };
    }

    const artifacts = resolveNyarBuildArtifacts(problem);
    if (!artifacts) {
        return {
            error: 'legion build 成功但找不到 `.nyar` 产物入口',
            artifacts: null,
            buildRoute: build.route,
        };
    }

    const evidence = readArtifactEvidence(artifactDir, plan);
    if (!evidence.fresh) {
        return {
            error: evidence.reason ?? 'legion build 未生成 execution manifest',
            artifacts: null,
            buildRoute: build.route,
        };
    }

    return { error: null, artifacts, buildRoute: build.route };
}

export type NyarReferenceOutcome = {
    ok: boolean;
    stderr: string;
    caseStats: SolverCaseStats;
};

export async function runNyarSolverOnce(problemRoot: string, pin?: NyarReferencePin): Promise<SolverCaseStats> {
    const blocked = (() => {
        try {
            const slug = JSON.parse(readFileSync(join(problemRoot, 'metadata.json'), 'utf8')).id as string;
            const problem = { id: slug } as ProblemDefinition;
            const projectDir = join(problemRoot, 'solvers', 'valkyrie');
            const artifacts = pin?.artifacts ?? (() => {
                const plan = resolveLaneTargetPlan(projectDir, NYAR_BUILD_TARGET);
                const build = ensureNyarBuild(problem, plan);
                if (build.error) {
                    throw new Error(build.error);
                }
                return build.artifacts;
            })();
            if (!artifacts) {
                return '无法 legion build --target ovm';
            }
            const { tests, invoke } = loadMetadata(problemRoot);
            const entry = invoke.valkyrie ?? invoke.typescript;
            if (!entry) {
                return 'metadata.invoke 缺失';
            }
            if (tests.length === 0) {
                return 'metadata.tests 缺失';
            }
            return nyarInvokeBlockedReason(artifacts.nyarPath, entry);
        } catch (err) {
            return String(err);
        }
    })();
    if (blocked) {
        throw new Error(blocked);
    }

    const pinEnv = pin
        ? encodeNyarExecutionPin({
            artifactDir: pin.artifacts.outDir,
            nyarPath: pin.artifacts.nyarPath,
            physicalEntry: pin.artifacts.physicalEntry,
            logicalEntry: pin.artifacts.logicalEntry,
            compileTarget: pin.compileTarget,
        })
        : {};

    const result = spawnSync(process.execPath, ['--import', 'tsx', RUN_NYAR_SOLVER, problemRoot], {
        encoding: 'utf8',
        cwd: join(LEETCODE_ROOT_FROM_PACKAGE, 'projects', 'conformance'),
        env: {
            ...process.env,
            ...pinEnv,
        },
    });
    const combined = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
    const caseStats = parseSolverResultLine(combined);
    if (result.status !== 0) {
        throw Object.assign(new Error(combined || 'run_nyar_solver failed'), { caseStats });
    }
    return caseStats ?? emptySolverCaseStats('solver 未执行完所有 case');
}

export async function runNyarReference(problem: ProblemDefinition, pin?: NyarReferencePin): Promise<NyarReferenceOutcome> {
    const root = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    try {
        const caseStats = await runNyarSolverOnce(root, pin);
        return { ok: caseStats.ok, stderr: '', caseStats };
    } catch (err) {
        const caseStats = (err as { caseStats?: SolverCaseStats }).caseStats
            ?? emptySolverCaseStats(String(err));
        return { ok: false, stderr: String(err), caseStats };
    }
}

export { loadMetadata, type TestCase } from '../valkyrie-node/ref.ts';
