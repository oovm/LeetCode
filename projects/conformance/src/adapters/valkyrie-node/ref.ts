import { spawnSync } from 'node:child_process';

import { mkdirSync, readFileSync } from 'node:fs';

import { join } from 'node:path';

import { pathToFileURL } from 'node:url';



import {
    NODE_WASM_TARGET,
    isArtifactCacheFresh,
    listWasmModuleExports,
    resolveArtifactDir,
    resolveNodeEntry,
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



export function vArtifactDir(problem: ProblemDefinition): string {

    return resolveArtifactDir(vBuildDir(problem), NODE_WASM_TARGET);

}



export function resolveVBuildArtifacts(problem: ProblemDefinition) {

    const outDir = resolveArtifactDir(vBuildDir(problem), NODE_WASM_TARGET);

    const entry = resolveNodeEntry(outDir);

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

        throw new Error('metadata.tests ???');

    }

    const entry = meta.invoke?.valkyrie ?? meta.invoke?.typescript;

    if (!entry) {

        throw new Error('metadata.invoke.valkyrie ?? invoke.typescript ??');

    }

    return { tests, invoke: { valkyrie: meta.invoke?.valkyrie, typescript: meta.invoke?.typescript } };

}



/** ???? wasm ?????????§Ò??Node ???? WebAssembly???????? `format-spy`???? */
export function listWasmExports(wasmPath: string): string[] {
    return listWasmModuleExports(wasmPath);
}



/** 126 ???? `main` ???? wasm??package ????¦Ä????????? */

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



/** ?? `metadata.invoke`???? `Solution().twoSum`?????? wasm ????????camelCase???? */

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



/** ????????? execution manifest §µ??? Node ???? */

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

    const artifactDir = resolveArtifactDir(outDir, NODE_WASM_TARGET);

    const cached = resolveVBuildArtifacts(problem);

    const freshness = isArtifactCacheFresh(artifactDir, NODE_WASM_TARGET);

    if (cached && freshness.fresh) {

        return { error: null, artifacts: cached, buildRoute: null };

    }



    mkdirSync(outDir, { recursive: true });

    const build = legionBuildNative(projectDir, outDir);

    if (build.status !== 0) {

        return {

            error: formatLegionError('legion build --target node', build),

            artifacts: null,

            buildRoute: build.route,

        };

    }



    const artifacts = resolveVBuildArtifacts(problem);

    if (!artifacts) {

        return {

            error: 'legion build --target node ????¦Ä??? wasm/js ????',

            artifacts: null,

            buildRoute: build.route,

        };

    }



    const rebuiltFreshness = isArtifactCacheFresh(artifactDir, NODE_WASM_TARGET);

    if (!rebuiltFreshness.fresh) {

        return {

            error: rebuiltFreshness.reason ?? 'legion build ?????????? execution manifest',

            artifacts: null,

            buildRoute: build.route,

        };

    }



    return { error: null, artifacts, buildRoute: build.route };

}



export function wasmInvokeBlockedReason(wasmPath: string, invokeEntry?: string): string | null {

    if (!valkyrieRunnerReady()) {

        return 'legion ¦Ä????';

    }

    if (isStubWasmArtifact(wasmPath)) {

        return (

            'wasm ?????? main?????¦Ä???????? MIR?????????¦²?package ???????? entry solution.v??' +

            '???? invoke ????????? node glue ?? callExport / JSON invoke'

        );

    }

    const exports = listWasmExports(wasmPath);

    if (invokeEntry) {

        const expected = resolveWasmExportSymbol(invokeEntry);

        if (!exports.includes(expected)) {

            return `wasm ??? metadata.invoke ????????? ${expected}?????§µ?${exports.join(', ') || '??'}??`;

        }

        return null;

    }

    const callable = exports.filter((name) => name !== 'main' && name !== '_start' && name !== 'memory' && !name.startsWith('cabi_'));

    if (callable.length === 0) {

        return `wasm ???? invoke ?????????????§µ?${exports.join(', ') || '??'})`;

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
                return '¦Ä??? legion build ???????? legion build --target node??';
            }
            const { tests, invoke } = loadMetadata(problemRoot);
            const entry = requireValkyrieInvokeEntry(invoke);
            if (tests.length === 0) {
                return 'metadata.tests ???';
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
    return caseStats ?? emptySolverCaseStats('solver ¦Ä??????????');
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


