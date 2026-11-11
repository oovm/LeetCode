/**
 * 消费者侧工具链身份（[01 §4.12] 工具链身份门）。
 *
 * 报告必须携带 compiler build identity 的可核验部分：native addon 的实际路径、
 * sha256 与修改时间。同版本不同构建必须可区分；身份与源码提交不可比时，
 * 红灯不得归因于最新源码。
 */
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';

import { legionNativePath } from '@nyar/valkyrie';

export type AddonIdentity =
    | { state: 'resolved'; path: string; sha256: string; mtimeIso: string }
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
