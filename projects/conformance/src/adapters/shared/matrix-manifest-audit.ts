/**
 * execution manifest 审计投影：只从已读取的 manifest 视图取值。
 *
 * 读取动作统一由 `readArtifactEvidence` 完成，这里禁止再次读盘，
 * 以免同一产物在报告里出现两份来源不同的证据。
 */

import type { ExecutionManifestView } from './artifact-evidence.ts';

export type MatrixManifestAudit = {
    manifestSchemaVersion: number | null;
    semanticClosureHash: string | null;
    canonicalSurfaceHash: string | null;
    hostProviderBindingHash: string | null;
};

export function readMatrixManifestAudit(manifest: ExecutionManifestView | null): MatrixManifestAudit {
    if (!manifest) {
        return {
            manifestSchemaVersion: null,
            semanticClosureHash: null,
            canonicalSurfaceHash: null,
            hostProviderBindingHash: null,
        };
    }
    return {
        manifestSchemaVersion: manifest.schema_version,
        semanticClosureHash: manifest.compile_evidence?.semantic_closure_hash ?? null,
        canonicalSurfaceHash: manifest.compile_evidence?.canonical_surface_hash ?? null,
        hostProviderBindingHash: manifest.compile_evidence?.host_provider_binding_hash ?? null,
    };
}
