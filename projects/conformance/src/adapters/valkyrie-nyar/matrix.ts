import type { ProblemDefinition } from '../../catalog/index.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import { probeValkyrieBackendProblem, type ValkyrieBackendMatrixRow } from '../valkyrie-backend/matrix.ts';

/**
 * 旧 nyar lane 的行：即 ovm 执行 lane（lane 显式 target `ovm`）。
 *
 * 探测逻辑已泛化到 `valkyrie-backend/matrix.ts`，本模块保留兼容导出面，
 * 行结构与通用后端行完全一致。
 */
export type ValkyrieNyarMatrixRow = ValkyrieBackendMatrixRow;

export async function probeValkyrieNyarProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieNyarMatrixRow> {
    return probeValkyrieBackendProblem(problem, projectPath, 'ovm');
}

/** 判断 `legion test` 是否通过 + manifest 一致 + `run_nyar_solver` cases 用例跑通。 */
export function isValkyrieNyarGreen(row: ValkyrieNyarMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
