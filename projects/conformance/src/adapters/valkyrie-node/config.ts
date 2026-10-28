/**
 * valkyrie-node adapter 的配置。
 *
 * 本模块只表达 runner 层**固定的执行宿主**：Node.js。
 *
 * compile target（编译目标别名，如 "wasm"、"node"）**不在此配置** ——
 * 它的**唯一来源**是各题解 `legion.von` 的 `build[0].target` 字段。
 * 见 `manifest.ts` 的 `resolveCompileTargetFromManifest`。
 */

/** 当前 valkyrie-node adapter 固定的 runner 宿主：Node.js。 */
export const RUNNER_HOST = 'node';

/** valkyrie-node adapter 全部固定配置（仅执行宿主，不含编译目标）。 */
export const VALKYRIE_NODE = {
    runnerHost: RUNNER_HOST,
} as const;

/** runnerHost 的所有可能值（为将来扩展预留）。 */
export type RunnerHost = 'node';
