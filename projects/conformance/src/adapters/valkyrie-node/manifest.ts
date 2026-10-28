/**
 * 最小化 legion.von 解析 —— 只提取 runner 需要的 compile target。
 *
 * von 文件是 V 语言的对象字面量语法，与 JSON 的差异：
 *   1. 键名无引号（`name:` 而非 `"name":`）
 *   2. 可选尾部逗号
 *   3. 字符串 / 数字 / 布尔 / null 语法与 JSON 一致
 *
 * 我们在 runner 层只关心 `build[0].target`。
 * 为避免引入完整 von 解析器，这里把 von 源码转换成合法 JSON 后再 parse。
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** von 文件转 JSON：给无引号键名加双引号，去掉尾部逗号。 */
function vonToJson(source: string): string {
    // 移除单行注释 // ...（不处理 /* */，因为我们的 von 没用到）
    let s = source.replace(/\/\/[^\n]*/g, '');
    // 给 {, [ 后面、冒号前面的无引号标识符加双引号
    s = s.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_\-]*)(\s*:)/g, '$1"$2"$3');
    // 去掉 ,] 和 ,} 里的尾部逗号
    s = s.replace(/,\s*([}\]])/g, '$1');
    return s;
}

type LegionManifest = {
    build?: Array<{ target?: string }>;
};

/**
 * 从 solver 目录解析 compile target。
 *
 * @param solverDir  如 `…/solvers/valkyrie`
 * @returns build[0].target 的 alias（如 "wasm"、"node"）
 * @throws 如果 manifest 缺失、不可解析或没写 build[0].target
 */
export function resolveCompileTargetFromManifest(solverDir: string): string {
    const manifestPath = join(solverDir, 'legion.von');
    if (!existsSync(manifestPath)) {
        throw new Error(`resolveCompileTargetFromManifest: legion.von 不存在 — ${manifestPath}`);
    }
    const raw = readFileSync(manifestPath, 'utf8');
    let parsed: LegionManifest;
    try {
        parsed = JSON.parse(vonToJson(raw)) as LegionManifest;
    } catch (err) {
        throw new Error(
            `resolveCompileTargetFromManifest: 解析 legion.von 失败 — ${manifestPath}: ${String(err)}`,
        );
    }
    const target = parsed.build?.[0]?.target;
    if (!target || typeof target !== 'string') {
        throw new Error(
            `resolveCompileTargetFromManifest: build[0].target 缺失或不是字符串 — ${manifestPath}. ` +
                `legacy solver 必须显式声明 compile target，禁止默认 "node"。`,
        );
    }
    return target;
}
