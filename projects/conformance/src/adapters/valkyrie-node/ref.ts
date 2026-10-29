import { spawnSync } from 'node:child_process';

import { mkdirSync, readFileSync } from 'node:fs';

import { join } from 'node:path';

import { pathToFileURL } from 'node:url';



import {
    isArtifactCacheFreshForBuild,
    listWasmModuleExports,
    resolveArtifactEntry,
} from '@nyar/valkyrie';



import type { ProblemDefinition } from '../../catalog/index.ts';

import { problemDir, valkyrieProjectDir } from '../../catalog/index.ts';

import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';

import { encodeNodeExecutionPin } from '../shared/execution-pin.ts';
import { emptySolverCaseStats, parseSolverResultLine, type SolverCaseStats } from '../shared/solver-case-stats.ts';
import { formatLegionError, legionBuildNative, valkyrieRunnerReady } from './valkyrie.ts';



const RUN_V_SOLVER = join(LEETCODE_ROOT_FROM_PACKAGE, 'projects', 'conformance', 'scripts', 'run_v_solver.ts');



export type TestCase = { args: Record<string, unknown>; expected: unknown };



export type VBuildArtifacts = NonNullable<ReturnType<typeof resolveVBuildArtifacts>>;



export type VBuildOutcome = {

    error: string | null;

    artifacts: VBuildArtifacts | null;

    buildRoute: string | null;

};



export type VReferencePin = {

    artifacts: VBuildArtifacts;

    buildRoute: string | null;

};



export function vBuildDir(problem: ProblemDefinition): string {

    return join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-node`);

}



/**
 * artifact 目录 = build output dir。
 *
 * 历史上这里硬编码 canonical triple 做子目录，但 `@nyar/valkyrie` 的
 * `resolveArtifactDir(dir, _target)` 已经把 target 参数废弃（直接 return dir），
 * 所以 artifactDir 就是 outDir 本身。
 */
export function vArtifactDir(problem: ProblemDefinition): string {

    return vBuildDir(problem);

}



export function resolveVBuildArtifacts(problem: ProblemDefinition) {

    const outDir = vBuildDir(problem);

    const entry = resolveArtifactEntry(outDir);

    if (!entry) {

        return null;

    }

    return { outDir, entry };

}



export function loadMetadata(problemRoot: string): {

    tests: TestCase[];

    invoke: { valkyrie?: string; typescript?: string };

} {

    const meta = JSON.parse(readFileSync(join(problemRoot, 'metadata.json'), 'utf8')) as {

        tests?: TestCase[];

        invoke?: { valkyrie?: string; typescript?: string };

    };

    const tests = meta.tests;

    if (!tests?.length) {

        throw new Error('metadata.tests 缺失');

    }

    const entry = meta.invoke?.valkyrie ?? meta.invoke?.typescript;

    if (!entry) {

        throw new Error('metadata.invoke.valkyrie 与 invoke.typescript 均缺失');

    }

    return { tests, invoke: { valkyrie: meta.invoke?.valkyrie, typescript: meta.invoke?.typescript } };

}



/** 检查 wasm 导出是否只有 `main` —— 占位/桩 wasm，禁止 invoke。 */
export function listWasmExports(wasmPath: string): string[] {
    return listWasmModuleExports(wasmPath);
}



/** 126 字节只有 `main` 导出的 wasm 不是 package 编译产物。 */

export function isStubWasmArtifact(wasmPath: string): boolean {

    try {

        const bytes = readFileSync(wasmPath);

        if (bytes.length > 512) {

            return false;

        }

        const exports = listWasmExports(wasmPath);

        return exports.length <= 1 && exports.every((name) => name === 'main' || name === '_start');

    } catch {

        return true;

    }

}



/** 从 `metadata.invoke` 提取 `Solution().twoSum` 里的 wasm export symbol（camelCase 方法名）。 */

export function resolveWasmExportSymbol(invokeEntry: string): string {

    const trimmed = invokeEntry.trim();

    const methodMatch = trimmed.match(/\.([A-Za-z_][A-Za-z0-9_]*)$/);

    if (methodMatch) {

        return methodMatch[1];

    }

    const callMatch = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\(/);

    if (callMatch) {

        return callMatch[1];

    }

    return trimmed;

}



/** Valkyrie 入口合同错误码。 */
export type ValkyrieEntryContractErrorCode = 'valkyrie_entry_contract_failure';

/** Valkyrie 产物入口合同失败：`metadata.invoke.valkyrie` 缺失或为空。 */
export class ValkyrieEntryContractError extends Error {
    readonly code: ValkyrieEntryContractErrorCode = 'valkyrie_entry_contract_failure';

    constructor(message: string) {
        super(message);
        this.name = 'ValkyrieEntryContractError';
    }
}

/**
 * 解析 Valkyrie 产物的 invoke 入口。
 *
 * 只认 `metadata.invoke.valkyrie`：它是 wasm export 的稳定身份。缺失即入口合同失败，
 * 禁止回退到 `metadata.invoke.typescript`（TypeScript 入口不是 wasm export 身份）。
 */
export function requireValkyrieInvokeEntry(invoke: { valkyrie?: string; typescript?: string }): string {
    const entry = invoke.valkyrie?.trim();
    if (!entry) {
        throw new ValkyrieEntryContractError(
            'Valkyrie entry contract failure：metadata.invoke.valkyrie 缺失，禁止回退到 metadata.invoke.typescript',
        );
    }
    return entry;
}

export function ensureVBuild(problem: ProblemDefinition, projectDir: string): VBuildOutcome {

    const outDir = vBuildDir(problem);

    const artifactDir = outDir;

    // 验收必须反映当前源码。产物是否过期由源码闭包决定，而 `isArtifactCacheFreshForBuild`
    // 只看执行 manifest 与 target，不看入口源码内容；这里不能复用它来跳过构建。
    // 构建本身有 `legion build` 自己的缓存，harness 不做第二层缓存判断。
    mkdirSync(outDir, { recursive: true });

    const build = legionBuildNative(projectDir, outDir);

    if (build.status !== 0) {

        return {

            error: formatLegionError('legion build', build),

            artifacts: null,

            buildRoute: build.route,

        };

    }



    const artifacts = resolveVBuildArtifacts(problem);

    if (!artifacts) {

        return {

            error: 'legion build 成功但找不到 wasm/js 入口',

            artifacts: null,

            buildRoute: build.route,

        };

    }



    const rebuiltFreshness = isArtifactCacheFreshForBuild(artifactDir);

    if (!rebuiltFreshness.fresh) {

        return {

            error: rebuiltFreshness.reason ?? 'legion build 未生成 execution manifest',

            artifacts: null,

            buildRoute: build.route,

        };

    }



    return { error: null, artifacts, buildRoute: build.route };

}



export function wasmInvokeBlockedReason(wasmPath: string, invokeEntry?: string): string | null {

    if (!valkyrieRunnerReady()) {

        return 'legion 未就绪';

    }

    if (isStubWasmArtifact(wasmPath)) {

        return (

            'wasm 只有 main 导出 —— 不是 package 编译产物。确认 solution.v 是否真的调用了 export，' +

            '并确保 invoke 入口与 node glue 兼容（callExport / JSON invoke）。'

        );

    }

    const exports = listWasmExports(wasmPath);

    if (invokeEntry) {

        const expected = resolveWasmExportSymbol(invokeEntry);

        if (!exports.includes(expected)) {

            return `wasm 里找不到 metadata.invoke 对应的 export "${expected}"（已有: ${exports.join(', ') || '(none)'}）。`;

        }

        return null;

    }

    const callable = exports.filter((name) => name !== 'main' && name !== '_start' && name !== 'memory' && !name.startsWith('cabi_'));

    if (callable.length === 0) {

        return `wasm 里没有可 invoke 的 export（已有: ${exports.join(', ') || '(none)'}）。`;

    }

    return null;

}



export type VReferenceOutcome = {

    ok: boolean;

    stderr: string;

    caseStats: SolverCaseStats;

};

export async function runVSolverOnce(problemRoot: string, pin?: VReferencePin): Promise<SolverCaseStats> {
    const blocked = (() => {
        try {
            const metaPath = join(problemRoot, 'metadata.json');
            const slug = JSON.parse(readFileSync(metaPath, 'utf8')).id as string;
            const problem = { id: slug } as ProblemDefinition;
            const projectDir = join(problemRoot, 'solvers', 'valkyrie');
            const artifacts = pin?.artifacts ?? (() => {
                const build = ensureVBuild(problem, projectDir);
                if (build.error) {
                    throw new Error(build.error);
                }
                return build.artifacts;
            })();
            if (!artifacts) {
                return '无法 legion build —— 检查 legion.von 与编译环境';
            }
            const { tests, invoke } = loadMetadata(problemRoot);
            const entry = requireValkyrieInvokeEntry(invoke);
            if (tests.length === 0) {
                return 'metadata.tests 缺失';
            }
            return wasmInvokeBlockedReason(artifacts.entry.legionWasm, entry);
        } catch (err) {
            return String(err);
        }
    })();

    if (blocked) {
        throw new Error(blocked);
    }

    const pinEnv = pin
        ? encodeNodeExecutionPin({
            artifactDir: pin.artifacts.outDir,
            legionMjs: pin.artifacts.entry.legionMjs,
            legionWasm: pin.artifacts.entry.legionWasm,
            physicalEntry: pin.artifacts.entry.physicalEntry,
        })
        : {};

    const result = spawnSync(process.execPath, ['--import', 'tsx', RUN_V_SOLVER, problemRoot], {
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
        throw Object.assign(new Error(combined || 'run_v_solver failed'), { caseStats });
    }
    return caseStats ?? emptySolverCaseStats('solver 未执行完所有 case');
}

export async function runVReference(problem: ProblemDefinition, pin?: VReferencePin): Promise<VReferenceOutcome> {
    const root = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    try {
        const caseStats = await runVSolverOnce(root, pin);
        return { ok: caseStats.ok, stderr: '', caseStats };
    } catch (err) {
        const caseStats = (err as { caseStats?: SolverCaseStats }).caseStats
            ?? emptySolverCaseStats(String(err));
        return { ok: false, stderr: String(err), caseStats };
    }
}



export function valkyrieProjectPath(problem: ProblemDefinition): string {

    return valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);

}



export function vSolverModuleUrl(problemRoot: string): string {

    return pathToFileURL(join(problemRoot, 'solvers', 'valkyrie', 'solution.v')).href;

}
