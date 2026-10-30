/**
 * 产物证据：以 `CompileTargetPlan` 为唯一期望值读取本次 artifact 的 target 证据与新鲜度。
 *
 * 只读一次 execution manifest，同时给出 evidence target、freshness 与可诊断原因；
 * 期望 target 永远来自计划对象，禁止再从 artifact 自身反推期望值（否则证据漂移不可见）。
 */

import { isArtifactCacheFresh, readExecutionManifest } from '@nyar/valkyrie';

import type { CompileTargetPlan } from './compile-target-plan.ts';

/** `readExecutionManifest` 的返回视图（Rust 侧字段在此投影）。 */
export type ExecutionManifestView = {
    schema_version: number;
    target: string;
    compile_evidence: {
        semantic_closure_hash?: string;
        canonical_surface_hash?: string;
        host_provider_binding_hash?: string;
    };
};

export type ArtifactEvidence = {
    /** 计划期望的 canonical triple。 */
    expectedTarget: string;
    /** execution manifest 实际记录的 canonical triple；缺失为 null。 */
    manifestTarget: string | null;
    /** 同一次读取得到的 execution manifest，供 manifest audit 复用。 */
    manifest: ExecutionManifestView | null;
    /** 按计划期望 target 判定的新鲜度。 */
    fresh: boolean;
    /** 不新鲜或证据漂移时的可诊断原因。 */
    reason: string | null;
};

/**
 * 读取产物证据。
 *
 * freshness 的 expected target 固定为 `plan.canonicalTarget`；artifact 记录的 target
 * 只作为证据，不再充当期望值，因此 target 漂移会表现为不新鲜并带原因。
 */
export function readArtifactEvidence(artifactDir: string, plan: CompileTargetPlan): ArtifactEvidence {
    const manifest = readExecutionManifest(artifactDir) as ExecutionManifestView | null;
    if (!manifest) {
        return {
            expectedTarget: plan.canonicalTarget,
            manifestTarget: null,
            manifest: null,
            fresh: false,
            reason: '缺少 execution manifest',
        };
    }
    const freshness = isArtifactCacheFresh(artifactDir, plan.canonicalTarget);
    return {
        expectedTarget: plan.canonicalTarget,
        manifestTarget: manifest.target,
        manifest,
        fresh: freshness.fresh,
        reason: freshness.fresh ? null : freshness.reason ?? 'artifact 与当前源码或计划不匹配',
    };
}
