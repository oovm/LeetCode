/**
 * runtime 状态推导：只由本次实际 artifact 证据决定，禁止硬编码或按 runner 就绪猜测。
 *
 * ready   —— 产物可 invoke，reference 已执行（用例是否全过由 runtimeOk / 用例计数表达）
 * blocked —— 产物存在但不可用或不一致（证据不新鲜、入口/导出缺失、ABI 阻塞）
 * pending —— 尚未产出可判定产物（build 未通过或未执行）
 */

import type { ArtifactEvidence } from './artifact-evidence.ts';

export type ArtifactRuntimeStatus = 'ready' | 'blocked' | 'pending';

export type ArtifactRuntimeVerdict = {
    status: ArtifactRuntimeStatus;
    reason: string | null;
};

export type ArtifactRuntimeInput = {
    /** build 是否成功（exit 0）。 */
    buildOk: boolean;
    /** 是否解析到可 invoke 的产物入口。 */
    artifactsPresent: boolean;
    /** 产物证据；无产物时可为 null。 */
    evidence: ArtifactEvidence | null;
    /** ABI / 导出层面的 invoke 阻塞原因；可 invoke 时为 null。 */
    invokeBlocker: string | null;
};

export function deriveArtifactRuntimeStatus(input: ArtifactRuntimeInput): ArtifactRuntimeVerdict {
    if (!input.buildOk) {
        return { status: 'pending', reason: 'build 未通过，runtime 未执行' };
    }
    if (!input.artifactsPresent) {
        return { status: 'blocked', reason: 'build 成功但未落盘可执行产物入口' };
    }
    if (!input.evidence) {
        return { status: 'blocked', reason: '缺少 execution manifest 证据' };
    }
    if (!input.evidence.fresh) {
        return { status: 'blocked', reason: input.evidence.reason ?? 'artifact 证据不新鲜' };
    }
    if (input.invokeBlocker) {
        return { status: 'blocked', reason: input.invokeBlocker };
    }
    return { status: 'ready', reason: null };
}
