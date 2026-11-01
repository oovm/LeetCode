/**
 * 对照 lane（`jvm` / `clr`）的 managed 产物证据。
 *
 * managed pipeline 当前只落盘 `jar` / `dll` 与 `compile-evidence.txt`，不落
 * `run-contracts.txt`（execution manifest），也没有 managed ABI invoke 合同。
 * 这里只做**只读证据识别**：产物是否存在、compile-evidence 的三份 digest 是什么。
 * 不执行 managed 产物、不发明第二套 ABI，也不把该证据升级成 execution manifest。
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export type ManagedContrastLane = 'jvm' | 'clr';

/** compile-evidence sidecar 的三份 digest；缺失字段如实为 null。 */
export type ManagedCompileEvidence = {
    semanticClosureHash: string | null;
    canonicalSurfaceHash: string | null;
    hostProviderBindingHash: string | null;
};

const MANAGED_ARTIFACT_SUFFIX: Record<ManagedContrastLane, string> = {
    jvm: '.jar',
    clr: '.dll',
};

const EVIDENCE_FILE_NAME = 'compile-evidence.txt';

/**
 * 解析本轮 build 输出的 managed 产物。
 *
 * 目录里必须恰好有一个目标扩展名的产物，否则返回 null（结构化成因交给调用方记录）。
 */
export function resolveManagedArtifact(outDir: string, lane: ManagedContrastLane): string | null {
    let entries: string[];
    try {
        entries = readdirSync(outDir);
    } catch {
        return null;
    }
    const candidates = entries.filter((entry) => entry.toLowerCase().endsWith(MANAGED_ARTIFACT_SUFFIX[lane]));
    if (candidates.length !== 1) {
        return null;
    }
    return join(outDir, candidates[0] as string);
}

/** 读取 managed build 的 compile-evidence sidecar；文件缺失或字段缺失如实返回 null。 */
export function readManagedCompileEvidence(outDir: string): ManagedCompileEvidence | null {
    let source: string;
    try {
        source = readFileSync(join(outDir, EVIDENCE_FILE_NAME), 'utf8');
    } catch {
        return null;
    }
    const pick = (key: string): string | null => {
        const matched = source.match(new RegExp(`${key}="([^"]*)"`));
        return matched ? matched[1] : null;
    };
    const evidence: ManagedCompileEvidence = {
        semanticClosureHash: pick('semantic_closure_hash'),
        canonicalSurfaceHash: pick('canonical_surface_hash'),
        hostProviderBindingHash: pick('host_provider_binding_hash'),
    };
    if (!evidence.semanticClosureHash && !evidence.canonicalSurfaceHash && !evidence.hostProviderBindingHash) {
        return null;
    }
    return evidence;
}
