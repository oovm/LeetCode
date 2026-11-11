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

/**
 * execution pin 三态（[01 §4.12] 工具链身份门）：
 * - `absent`：本 lane 的 pin 键一个都没有出现，子进程允许独立构建。
 * - `valid`：字段完整且指定产物存在，子进程必须执行已核验产物。
 * - `invalid`：任一 pin 键出现但字段不完整，或指定产物已消失。必须失败，
 *   不得与 `absent` 合并（否则父进程交付的产物身份被静默丢弃）。
 */
export type ExecutionPinReading<T> =
    | { state: 'absent' }
    | { state: 'valid'; pin: T }
    | { state: 'invalid'; reason: string };

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

type EnvView = Record<string, string | undefined>;

/**
 * 三态读取的公共骨架：
 * 1. 所有键都未出现（`undefined`）→ `absent`。
 * 2. 任一键出现但必需字段缺失或为空 → `invalid`（列出缺失字段的环境变量名）。
 * 3. 字段完整但指定产物文件消失 → `invalid`（列出消失的路径）。
 */
function readPinTriState<T>(
    env: EnvView,
    keys: readonly string[],
    build: (values: Record<string, string>) => T,
    artifactPaths: (pin: T) => readonly { label: string; path: string }[],
): ExecutionPinReading<T> {
    const present = keys.filter((key) => env[key] !== undefined);
    if (present.length === 0) {
        return { state: 'absent' };
    }
    const missing = keys.filter((key) => env[key] === undefined || env[key]!.trim().length === 0);
    if (missing.length > 0) {
        return {
            state: 'invalid',
            reason: `pin 字段不完整：缺少 ${missing.join(', ')}（已出现 ${present.join(', ')}）。禁止退回独立构建`,
        };
    }
    const values = Object.fromEntries(keys.map((key) => [key, env[key]!])) as Record<string, string>;
    const pin = build(values);
    const vanished = artifactPaths(pin).filter((item) => !existsSync(item.path));
    if (vanished.length > 0) {
        return {
            state: 'invalid',
            reason: `pin 指定产物消失：${vanished.map((item) => `${item.label}=${item.path}`).join(', ')}。禁止退回独立构建`,
        };
    }
    return { state: 'valid', pin };
}

/** 三态读取 node lane pin；`invalid` 必须失败，不得与 `absent` 合并。 */
export function readNodeExecutionPin(env: EnvView = process.env): ExecutionPinReading<NodeExecutionPin> {
    return readPinTriState(
        env,
        [PIN_ARTIFACT_DIR, PIN_LEGION_MJS, PIN_LEGION_WASM, PIN_PHYSICAL_ENTRY, PIN_COMPILE_TARGET],
        (values) => ({
            artifactDir: values[PIN_ARTIFACT_DIR],
            legionMjs: values[PIN_LEGION_MJS],
            legionWasm: values[PIN_LEGION_WASM],
            physicalEntry: values[PIN_PHYSICAL_ENTRY],
            compileTarget: values[PIN_COMPILE_TARGET],
        }),
        (pin) => [
            { label: PIN_LEGION_MJS, path: pin.legionMjs },
            { label: PIN_LEGION_WASM, path: pin.legionWasm },
        ],
    );
}

/** 三态读取 nyar lane pin；`invalid` 必须失败，不得与 `absent` 合并。 */
export function readNyarExecutionPin(env: EnvView = process.env): ExecutionPinReading<NyarExecutionPin> {
    return readPinTriState(
        env,
        [PIN_ARTIFACT_DIR, PIN_NYAR_PATH, PIN_PHYSICAL_ENTRY, PIN_LOGICAL_ENTRY, PIN_COMPILE_TARGET],
        (values) => ({
            artifactDir: values[PIN_ARTIFACT_DIR],
            nyarPath: values[PIN_NYAR_PATH],
            physicalEntry: values[PIN_PHYSICAL_ENTRY],
            logicalEntry: values[PIN_LOGICAL_ENTRY],
            compileTarget: values[PIN_COMPILE_TARGET],
        }),
        (pin) => [{ label: PIN_NYAR_PATH, path: pin.nyarPath }],
    );
}
