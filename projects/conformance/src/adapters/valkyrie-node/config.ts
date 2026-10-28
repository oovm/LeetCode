/**
 * valkyrie-node adapter 的构建/运行配置。
 *
 * 本模块将两个原本隐式混在一起的概念显式拆开：
 *
 * - `compileTarget`：编译目标别名，来自各题解 `legion.von` 的 `build[].target` 字段
 *   （如 "wasm"、"node"、"wasi"）。传递给 `legion build` / `legion test` / `legion bench`。
 * - `runnerHost`：conformance runner 的执行宿主（如 "node"、"d8"、"wasmtime"）。
 *   决定 runner 如何加载产物（.mjs glue、browser iframe、CLI wasmtime）。
 *
 * 历史上这两个概念被合并在 `@nyar/valkyrie` 的 `NODE_WASM_TARGET`（canonical triple
 * `wasm32-node-unknown-wasm`）和 `WASM_NODE_BENCH_TARGET`（'node' alias）两个常量里。
 * 现在我们在 adapter 层明确把它们分开，便于将来切换 runnerHost。
 *
 * 注：CanonicalTarget 别名 → canonical triple 的映射由 `@nyar/valkyrie`（底层
 * valkyrie-napi Rust）负责，本模块只表达 adapter 自己的选择，不重复那份映射。
 */

/** 当前 valkyrie-node adapter 固定的 runner 宿主：Node.js。 */
export const RUNNER_HOST = 'node';

/** 当前默认的编译目标别名（legacy 默认值，所有现存 manifest 仍用 node）。 */
export const COMPILE_TARGET_DEFAULT = 'node';

/** canonical triple 仅用于本地缓存目录命名 / 与 execution manifest 对比：
 * 它是 compileTarget='node' + runnerHost='node' 组合下的完整 canonical form。
 * 当 compileTarget 改为 'wasm' 时 canonical triple 会变成 wasm32-unknown-browser-wasm，
 * 此时 freshness 检查应由 execution manifest 自己的 target 决定（用 isArtifactCacheFreshForBuild）。 */
export const CANONICAL_TARGET_NODE_WASM = 'wasm32-node-unknown-wasm';

/** bench 场景下传给 `legion bench` 的 target alias（与 COMPILE_TARGET_DEFAULT 保持一致）。 */
export const BENCH_COMPILE_TARGET = COMPILE_TARGET_DEFAULT;

/** valkyrie-node adapter 全部配置。 */
export const VALKYRIE_NODE = {
    runnerHost: RUNNER_HOST,
    compileTargetDefault: COMPILE_TARGET_DEFAULT,
    canonicalTargetNodeWasm: CANONICAL_TARGET_NODE_WASM,
    benchCompileTarget: BENCH_COMPILE_TARGET,
} as const;

/** runnerHost 的所有可能值（为将来扩展预留）。 */
export type RunnerHost = 'node';
