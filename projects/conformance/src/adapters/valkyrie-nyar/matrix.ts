import type { ProblemDefinition } from '../../catalog/index.ts';
import { formatLegionError, legionBuildNyar, legionTestNyar } from './valkyrie.ts';

export type ValkyrieNyarMatrixRow = {
    id: string;
    buildStatus: number;
    testStatus: number;
    buildRoute: string | null;
    testRoute: string | null;
    buildError: string | null;
    testError: string | null;
};

export function probeValkyrieNyarProblem(problem: ProblemDefinition, projectPath: string, outDir: string): ValkyrieNyarMatrixRow {
    const build = legionBuildNyar(projectPath, outDir);
    const test = legionTestNyar(projectPath);

    return {
        id: problem.id,
        buildStatus: build.status,
        testStatus: test.status,
        buildRoute: build.route,
        testRoute: test.route,
        buildError: build.status === 0 ? null : formatLegionError('legion build --target nyar', build),
        testError: test.status === 0 ? null : formatLegionError('legion test --target nyar', test),
    };
}

export function isValkyrieNyarGreen(row: ValkyrieNyarMatrixRow): boolean {
    return row.buildStatus === 0 && row.testStatus === 0;
}
