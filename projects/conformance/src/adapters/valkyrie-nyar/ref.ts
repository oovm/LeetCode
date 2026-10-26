import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { isArtifactCacheFreshForBuild, resolveArtifactDir, resolveNyarEntry } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir, valkyrieProjectDir } from '../../catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import { encodeNyarExecutionPin } from '../shared/execution-pin.ts';
import { emptySolverCaseStats, parseSolverResultLine, type SolverCaseStats } from '../shared/solver-case-stats.ts';
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

/** ???? `legion build --target nyar` ?????§Ö? `.nyar` ?? run-contract ???? */
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

/** ?§Ô? `.nyar` ?????????`nyar-vm list`???? */
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
        return 'legion ?? nyar-vm ¦Ä????';
    }
    const exports = listNyarExports(nyarPath);
    if (exports.length === 0) {
        return '`.nyar` ?????????? nyar-vm list ???';
    }
    if (invokeEntry) {
        const expected = resolveWasmExportSymbol(invokeEntry);
        if (!exports.includes(expected)) {
            return `.nyar ??? metadata.invoke ????????? ${expected}?????§µ?${exports.join(', ') || '??'}??`;
        }
    }
    return null;
}

/** ????????? execution manifest §µ??? Nyar ???? */
export function ensureNyarBuild(problem: ProblemDefinition, projectDir: string): NyarBuildOutcome {
    const outDir = nyarBuildDir(problem);
    const artifactDir = resolveArtifactDir(outDir, 'ovm');
    const cached = resolveNyarBuildArtifacts(problem);
    const freshness = isArtifactCacheFreshForBuild(artifactDir);
    if (cached && freshness.fresh) {
        return { error: null, artifacts: cached, buildRoute: null };
    }

    mkdirSync(outDir, { recursive: true });
    const build = legionBuildNyar(projectDir, outDir);
    if (build.status !== 0) {
        return {
            error: formatLegionError('legion build --target ovm', build),
            artifacts: null,
            buildRoute: build.route,
        };
    }

    const artifacts = resolveNyarBuildArtifacts(problem);
    if (!artifacts) {
        return {
            error: 'legion build --target nyar ????¦Ä??? .nyar ????',
            artifacts: null,
            buildRoute: build.route,
        };
    }

    const rebuiltFreshness = isArtifactCacheFreshForBuild(artifactDir);
    if (!rebuiltFreshness.fresh) {
        return {
            error: rebuiltFreshness.reason ?? 'legion build ?????????? execution manifest',
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
                const build = ensureNyarBuild(problem, projectDir);
                if (build.error) {
                    throw new Error(build.error);
                }
                return build.artifacts;
            })();
            if (!artifacts) {
                return '¦Ä??? legion build --target nyar ????';
            }
            const { tests, invoke } = loadMetadata(problemRoot);
            const entry = invoke.valkyrie ?? invoke.typescript;
            if (!entry) {
                return 'metadata.invoke ??';
            }
            if (tests.length === 0) {
                return 'metadata.tests ???';
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
        })
        : {};

    const result = spawnSync(process.execPath, ['--import', 'tsx', RUN_NYAR_SOLVER, problemRoot], {
        encoding: 'utf8',
        cwd: join(LEETCODE_ROOT_FROM_PACKAGE, 'projects', 'conformance'),
        env: {
            ...process.env,
            NYAR_VM: locateNyarVmBinary() ?? '',
            ...pinEnv,
        },
    });
    const combined = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
    const caseStats = parseSolverResultLine(combined);
    if (result.status !== 0) {
        throw Object.assign(new Error(combined || 'run_nyar_solver failed'), { caseStats });
    }
    return caseStats ?? emptySolverCaseStats('solver ¦Ä??????????');
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

export { locateNyarVmBinary } from './valkyrie.ts';
export { loadMetadata, type TestCase } from '../valkyrie-node/ref.ts';
