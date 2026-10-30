import { describe, expect, it } from 'vitest';

import type { ArtifactEvidence } from '../src/adapters/shared/artifact-evidence.ts';
import { deriveArtifactRuntimeStatus } from '../src/adapters/shared/artifact-runtime-status.ts';

function freshEvidence(): ArtifactEvidence {
    return {
        expectedTarget: 'wasm32-unknown-unknown-wasm',
        manifestTarget: 'wasm32-unknown-unknown-wasm',
        manifest: { schema_version: 3, target: 'wasm32-unknown-unknown-wasm', compile_evidence: {} },
        fresh: true,
        reason: null,
    };
}

describe('artifact runtime status', () => {
    it('build 未通过时为 pending，并保留原因', () => {
        const verdict = deriveArtifactRuntimeStatus({
            buildOk: false,
            artifactsPresent: false,
            evidence: null,
            invokeBlocker: null,
        });
        expect(verdict.status).toBe('pending');
        expect(verdict.reason).toContain('build');
    });

    it('build 成功但没有产物入口时为 blocked', () => {
        expect(deriveArtifactRuntimeStatus({
            buildOk: true,
            artifactsPresent: false,
            evidence: null,
            invokeBlocker: null,
        }).status).toBe('blocked');
    });

    it('缺少 execution manifest 证据时为 blocked', () => {
        expect(deriveArtifactRuntimeStatus({
            buildOk: true,
            artifactsPresent: true,
            evidence: null,
            invokeBlocker: null,
        }).status).toBe('blocked');
    });

    it('证据不新鲜时 blocked，并透传漂移原因', () => {
        const verdict = deriveArtifactRuntimeStatus({
            buildOk: true,
            artifactsPresent: true,
            evidence: { ...freshEvidence(), fresh: false, reason: 'artifact target 与计划不一致' },
            invokeBlocker: null,
        });
        expect(verdict.status).toBe('blocked');
        expect(verdict.reason).toBe('artifact target 与计划不一致');
    });

    it('invoke 阻塞时 blocked，并保留阻塞原因', () => {
        const verdict = deriveArtifactRuntimeStatus({
            buildOk: true,
            artifactsPresent: true,
            evidence: freshEvidence(),
            invokeBlocker: 'wasm 里找不到 export',
        });
        expect(verdict.status).toBe('blocked');
        expect(verdict.reason).toBe('wasm 里找不到 export');
    });

    it('产物可 invoke 时为 ready', () => {
        const verdict = deriveArtifactRuntimeStatus({
            buildOk: true,
            artifactsPresent: true,
            evidence: freshEvidence(),
            invokeBlocker: null,
        });
        expect(verdict).toEqual({ status: 'ready', reason: null });
    });
});
