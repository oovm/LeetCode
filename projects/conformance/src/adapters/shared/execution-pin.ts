import { existsSync } from 'node:fs';

/** 父进程向 `run_*_solver` 子进程传递已验证产物身份的环境变量键。 */
export const PIN_ARTIFACT_DIR = 'VALKYRIE_PIN_ARTIFACT_DIR';
export const PIN_LEGION_MJS = 'VALKYRIE_PIN_LEGION_MJS';
export const PIN_LEGION_WASM = 'VALKYRIE_PIN_LEGION_WASM';
export const PIN_PHYSICAL_ENTRY = 'VALKYRIE_PIN_PHYSICAL_ENTRY';
export const PIN_NYAR_PATH = 'VALKYRIE_PIN_NYAR_PATH';
export const PIN_LOGICAL_ENTRY = 'VALKYRIE_PIN_LOGICAL_ENTRY';
/** 已验证产物所对应的 canonical compile target（期望值，禁止子进程再从 artifact 反推）。 */
export const PIN_COMPILE_TARGET = 'VALKYRIE_PIN_COMPILE_TARGET';

export type NodeExecutionPin = {
    artifactDir: string;
    legionMjs: string;
    legionWasm: string;
    physicalEntry: string;
    /** `CompileTargetPlan.canonicalTarget`。 */
    compileTarget: string;
};

export type NyarExecutionPin = {
    artifactDir: string;
    nyarPath: string;
    physicalEntry: string;
    logicalEntry: string;
    /** `CompileTargetPlan.canonicalTarget`。 */
    compileTarget: string;
};

export function encodeNodeExecutionPin(pin: NodeExecutionPin): Record<string, string> {
    return {
        [PIN_ARTIFACT_DIR]: pin.artifactDir,
        [PIN_LEGION_MJS]: pin.legionMjs,
        [PIN_LEGION_WASM]: pin.legionWasm,
        [PIN_PHYSICAL_ENTRY]: pin.physicalEntry,
        [PIN_COMPILE_TARGET]: pin.compileTarget,
    };
}

export function encodeNyarExecutionPin(pin: NyarExecutionPin): Record<string, string> {
    return {
        [PIN_ARTIFACT_DIR]: pin.artifactDir,
        [PIN_NYAR_PATH]: pin.nyarPath,
        [PIN_PHYSICAL_ENTRY]: pin.physicalEntry,
        [PIN_LOGICAL_ENTRY]: pin.logicalEntry,
        [PIN_COMPILE_TARGET]: pin.compileTarget,
    };
}

/** 缺少任一必需字段（含 compileTarget）的 pin 视为不完整，返回 null 让子进程重建计划。 */
export function readNodeExecutionPinFromEnv(): NodeExecutionPin | null {
    const artifactDir = process.env[PIN_ARTIFACT_DIR];
    const legionMjs = process.env[PIN_LEGION_MJS];
    const legionWasm = process.env[PIN_LEGION_WASM];
    const physicalEntry = process.env[PIN_PHYSICAL_ENTRY];
    const compileTarget = process.env[PIN_COMPILE_TARGET];
    if (!artifactDir || !legionMjs || !legionWasm || !physicalEntry || !compileTarget) {
        return null;
    }
    if (!existsSync(legionMjs) || !existsSync(legionWasm)) {
        return null;
    }
    return { artifactDir, legionMjs, legionWasm, physicalEntry, compileTarget };
}

/** 缺少任一必需字段（含 compileTarget）的 pin 视为不完整，返回 null 让子进程重建计划。 */
export function readNyarExecutionPinFromEnv(): NyarExecutionPin | null {
    const artifactDir = process.env[PIN_ARTIFACT_DIR];
    const nyarPath = process.env[PIN_NYAR_PATH];
    const physicalEntry = process.env[PIN_PHYSICAL_ENTRY];
    const logicalEntry = process.env[PIN_LOGICAL_ENTRY];
    const compileTarget = process.env[PIN_COMPILE_TARGET];
    if (!artifactDir || !nyarPath || !physicalEntry || !logicalEntry || !compileTarget) {
        return null;
    }
    if (!existsSync(nyarPath)) {
        return null;
    }
    return { artifactDir, nyarPath, physicalEntry, logicalEntry, compileTarget };
}
