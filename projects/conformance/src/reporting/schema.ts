export type BenchLanguage = 'python' | 'typescript' | 'typescript-bun' | 'valkyrie' | 'wolfram-sxo' | 'matlab-sxo';

export type HostEnvironment = {
    platform: string;
    arch: string;
    osRelease: string;
    nodeVersion: string;
};

export type PythonBenchEnvironment = {
    language: 'python';
    runtimeVersion: string;
    metric: 'runtime';
    timingScope: 'in-process-metadata-tests';
    aggregation: 'median';
    iterations: number;
    warmup: number;
    host: HostEnvironment;
};

export type TypeScriptBenchEnvironment = {
    language: 'typescript';
    nodeVersion: string;
    tsxVersion: string | null;
    runner: 'tsx';
    metric: 'runtime';
    timingScope: 'in-process-metadata-tests';
    aggregation: 'median';
    iterations: number;
    warmup: number;
    host: HostEnvironment;
};

export type TypeScriptBunBenchEnvironment = {
    language: 'typescript-bun';
    bunVersion: string | null;
    runnerReady: boolean;
    skipReason: string | null;
    runner: 'bun';
    metric: 'runtime';
    timingScope: 'in-process-metadata-tests';
    aggregation: 'median';
    iterations: number;
    warmup: number;
    host: HostEnvironment;
};

export type ValkyrieBenchEnvironment = {
    language: 'valkyrie';
    /** 报告 lane：`wasm` 是 `0.0.x` 交付 lane；`nyar` 是旧 managed lane，不计入完成度。 */
    lane: 'wasm' | 'nyar';
    /** compile target 的来源策略：manifest 声明，或 lane 显式指定。 */
    targetPolicy: 'manifest-declared' | 'lane-explicit';
    legionVersion: string | null;
    legionRoute: string | null;
    runnerReady: boolean;
    skipReason: string | null;
    compileMetric: 'compile';
    runtimeMetric: 'runtime';
    aggregation: 'median';
    compileRuns: number;
    warmup: number;
    host: HostEnvironment;
};

export type LanguageBenchEnvironment =
    | PythonBenchEnvironment
    | TypeScriptBenchEnvironment
    | TypeScriptBunBenchEnvironment
    | ValkyrieBenchEnvironment
    | WolframSxoBenchEnvironment
    | MatlabSxoBenchEnvironment;

export type WolframSxoBenchEnvironment = {
    language: 'wolfram-sxo';
    sxoMathematicaVersion: string | null;
    runnerReady: boolean;
    skipReason: string | null;
    metric: 'runtime';
    timingScope: 'in-process-metadata-tests';
    aggregation: 'median';
    iterations: number;
    warmup: number;
    host: HostEnvironment;
};

export type MatlabSxoBenchEnvironment = {
    language: 'matlab-sxo';
    sxoMatlabVersion: string | null;
    runnerReady: boolean;
    skipReason: string | null;
    metric: 'runtime';
    timingScope: 'in-process-metadata-tests';
    aggregation: 'median';
    iterations: number;
    warmup: number;
    host: HostEnvironment;
};


