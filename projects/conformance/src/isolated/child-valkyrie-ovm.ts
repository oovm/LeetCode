/**
 * V ovm lane 解法子进程（仅 Node 宿主）：加载 legion `ovm` 产物的 `.nyar` 入口，
 * 经 `valkyrie-napi` 平台绑定逐用例 invoke，走同一 NDJSON 协议。
 *
 * 实参注入口径与 `run_nyar_solver.ts` 一致：ovm 的 json bridge 只把 JSON 数字按
 * `as_i64` 精确解析，因此 `bigint` 一律以裸数字文本进入 argsJson（不经 double 往返）。
 */
import { existsSync, readFileSync, realpathSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { arch, platform } from 'node:os';
import { join } from 'node:path';

import { bindNativeArguments } from '../adapters/valkyrie-backend/native-runner.ts';
import { resolveNyarExport } from '../adapters/valkyrie-nyar/ref.ts';
import { resolveWasmExportSymbol } from '../adapters/valkyrie-node/ref.ts';
import { CONFORMANCE_ROOT } from '../domain/paths.ts';
import { executeRun } from './child-loops.ts';
import { serveChild } from './child-server.ts';
import type { Candidate } from './ts-entry.ts';

type OvmNativeAddon = {
    legionInvokeOvmExport: (module: string, entry: string, argsJson: string) => string;
};

/** 直接加载平台 `valkyrie-napi` 绑定，保证 `bigint` 能按裸数字文本注入 argsJson。 */
function loadOvmNative(): OvmNativeAddon {
    const require = createRequire(import.meta.url);
    const override = process.env.VALKYRIE_NATIVE;
    if (override && override.trim().length > 0) {
        return require(override) as OvmNativeAddon;
    }
    const os = platform();
    const cpu = arch();
    const triple =
        os === 'win32' && cpu === 'x64'
            ? 'win32-x64-msvc'
            : os === 'linux' && cpu === 'x64'
              ? 'linux-x64-gnu'
              : os === 'darwin'
                ? `darwin-${cpu}`
                : `${os}-${cpu}`;
    const short = triple.startsWith('win32-') ? 'win32-x64' : triple.startsWith('linux-') ? 'linux-x64' : triple;
    const binary = `valkyrie.${triple}.node`;
    const packageRoot = realpathSync(join(CONFORMANCE_ROOT, 'node_modules', '@nyar', 'valkyrie'));
    const candidates = [
        join(packageRoot, 'platforms', `valkyrie-${short}`, 'lib', binary),
        join(packageRoot, 'platforms', `valkyrie-${short}`, binary),
        join(packageRoot, '..', '..', 'node_modules', `@nyar/valkyrie-${short}`, 'lib', binary),
        join(packageRoot, '..', '..', 'platforms', `valkyrie-${short}`, 'lib', binary),
        join(packageRoot, '..', '..', 'platforms', `valkyrie-${short}`, binary),
    ];
    for (const candidate of candidates) {
        if (existsSync(candidate)) {
            return require(candidate) as OvmNativeAddon;
        }
    }
    throw new Error('平台 valkyrie-napi 绑定不可用，无法 invoke ovm 产物');
}

/** 把单个实参序列化为 argsJson 片段；`bigint` 注入为裸数字文本，serde 按 `as_i64` 精确还原。 */
function serializeOvmArg(value: unknown): string {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return JSON.stringify(value);
}

let candidate: Candidate | null = null;

serveChild(
    async (message) => {
        if (!message.artifactDir) {
            throw new Error('valkyrie-ovm lane 的 load 消息缺少 artifactDir');
        }
        const nyarFile = readdirSync(message.artifactDir).find((name) => name.endsWith('.nyar'));
        if (!nyarFile) {
            throw new Error(`产物目录缺少 .nyar 入口：${message.artifactDir}`);
        }
        const nyarPath = join(message.artifactDir, nyarFile);
        void readFileSync(nyarPath); // 入口存在性校验，内容交给 napi 解析
        // 入口身份与冻结形参名都取自执行清单；清单缺失、签名不完整即失败。
        const resolution = resolveNyarExport(message.artifactDir, resolveWasmExportSymbol(message.invoke));
        if (resolution.state === 'blocked') {
            throw new Error(`OVM 执行清单合同不满足：${resolution.reason}`);
        }
        const exportName = resolution.exportName;
        const parameterNames = resolution.parameterNames;
        const native = loadOvmNative();
        candidate = (args) => {
            // 实参按声明名绑定为声明顺序；键集合不一致即失败，绝不按对象键序供货。
            const bound = bindNativeArguments(args, parameterNames);
            if (bound === null) {
                throw new Error(`实参字段 ${JSON.stringify(Object.keys(args))} 与冻结形参 ${JSON.stringify(parameterNames)} 不匹配`);
            }
            const argsJson = `[${bound.map(serializeOvmArg).join(',')}]`;
            return JSON.parse(native.legionInvokeOvmExport(nyarPath, exportName, argsJson)) as unknown;
        };
    },
    async (message) => {
        if (!candidate) {
            throw new Error('尚未 load 解法');
        }
        const outcome = await executeRun(candidate, message);
        return { type: 'done', results: outcome.results, samples: outcome.samples, collectMs: outcome.collectMs };
    },
);
