import { readExecutionManifest } from '@nyar/valkyrie';

/** execution manifest ??§Õ??????????????¦±? */
export type MatrixManifestAudit = {
    manifestSchemaVersion: number | null;
    semanticClosureHash: string | null;
    canonicalSurfaceHash: string | null;
    hostProviderBindingHash: string | null;
};

export function readMatrixManifestAudit(artifactDir: string): MatrixManifestAudit {
    const manifest = readExecutionManifest(artifactDir);
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
