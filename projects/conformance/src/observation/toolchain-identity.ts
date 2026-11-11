/**
 * 消费者侧工具链身份（工具链身份门）。
 *
 * 报告必须携带 compiler build identity 的可核验部分：native addon 的实际路径、
 * sha256 与修改时间，以及 addon 内嵌的编译器构建身份（git rev 或确定性回退摘要）
 * 与完整 toolchain fingerprint。同版本不同构建必须可区分；身份与源码提交不可比时，
 * 红灯不得归因于最新源码。
 */
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';

import { legionCompilerBuildIdentity, legionNativePath, legionToolchainFingerprint } from '@nyar/valkyrie';

export type AddonIdentity =
    | { state: 'resolved'; path: string; sha256: string; mtimeIso: string }
    | { state: 'unresolved'; reason: string };

/** addon 内嵌的编译器构建身份（Rust build script 捕获的 git rev / 确定性回退摘要）。 */
export type CompilerBuildIdentity =
    | { state: 'resolved'; identity: string; fingerprint: string }
    | { state: 'unresolved'; reason: string };

/** 解析并哈希当前平台 `valkyrie-napi` 绑定；解析或读取失败时如实报告，不伪造身份。 */
export function resolveAddonIdentity(): AddonIdentity {
    const nativePath = legionNativePath();
    if (nativePath === null) {
        return { state: 'unresolved', reason: 'valkyrie-napi 平台绑定未解析（legionNativePath 返回 null）' };
    }
    try {
        const bytes = readFileSync(nativePath);
        const sha256 = createHash('sha256').update(bytes).digest('hex');
        const mtimeIso = new Date(statSync(nativePath).mtimeMs).toISOString();
        return { state: 'resolved', path: nativePath, sha256, mtimeIso };
    } catch (err) {
        return { state: 'unresolved', reason: `addon 身份读取失败：${err instanceof Error ? err.message : String(err)}` };
    }
}

export function formatAddonIdentity(identity: AddonIdentity): string {
    if (identity.state === 'resolved') {
        return `addon sha256=${identity.sha256} mtime=${identity.mtimeIso} path=${identity.path}`;
    }
    return `addon UNRESOLVED: ${identity.reason}`;
}

/**
 * 读取 addon 内嵌的编译器构建身份与完整 toolchain fingerprint。
 * addon 未就绪或旧构建不暴露该出口时如实报告，不伪造身份。
 */
export function resolveCompilerBuildIdentity(): CompilerBuildIdentity {
    try {
        const identity = legionCompilerBuildIdentity();
        const fingerprint = legionToolchainFingerprint();
        if (identity.trim().length === 0) {
            return { state: 'unresolved', reason: 'addon 返回空编译器构建身份' };
        }
        return { state: 'resolved', identity, fingerprint };
    } catch (err) {
        return { state: 'unresolved', reason: `编译器构建身份读取失败：${err instanceof Error ? err.message : String(err)}` };
    }
}

export function formatCompilerBuildIdentity(identity: CompilerBuildIdentity): string {
    if (identity.state === 'resolved') {
        return `compiler-build=${identity.identity} fingerprint=${identity.fingerprint}`;
    }
    return `compiler-build UNRESOLVED: ${identity.reason}`;
}
