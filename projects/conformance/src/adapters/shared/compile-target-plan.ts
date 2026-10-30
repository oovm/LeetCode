/**
 * compile target 计划：manifest 声明 + `legionPlan` 规范化解析的唯一产物。
 *
 * matrix / bench / build / test / cache / freshness 必须共享同一个 `CompileTargetPlan`；
 * 禁止各处重复解析 `legion.von`，也禁止在无法确定 target 时猜测默认值。
 *
 * canonical triple 由 `legionPlan` 给出（编译器自己的 target 解析结果），
 * 这里不维护 alias → triple 的本地映射表。
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { legionPlanProject } from '@nyar/valkyrie';

export type CompileTargetPlanErrorCode =
    | 'manifest_missing'
    | 'manifest_unparsable'
    | 'manifest_target_missing'
    | 'manifest_target_ambiguous'
    | 'plan_failed'
    | 'plan_target_missing';

/** compile target 计划解析失败的结构化错误；不允许回落到默认 target。 */
export class CompileTargetPlanError extends Error {
    readonly code: CompileTargetPlanErrorCode;
    readonly manifestPath: string;

    constructor(code: CompileTargetPlanErrorCode, manifestPath: string, detail: string) {
        super(`${code}: ${detail} — ${manifestPath}`);
        this.name = 'CompileTargetPlanError';
        this.code = code;
        this.manifestPath = manifestPath;
    }
}

export type CompileTargetPlanSource = 'manifest' | 'lane-explicit';

export type CompileTargetPlan = {
    /** solver 工程目录（`…/solvers/valkyrie`）。 */
    solverDir: string;
    /** 声明所在 manifest 路径。 */
    manifestPath: string;
    /** 声明来源：manifest `build[].target` 或 lane 显式指定。 */
    source: CompileTargetPlanSource;
    /** 声明原文（alias 或 canonical triple）。 */
    declaredTarget: string;
    /** `legionPlan` 规范化后的 canonical triple —— build/test/freshness 的唯一执行身份。 */
    canonicalTarget: string;
};

/** von 源码转 JSON 投影：去行注释、给无引号键名加双引号、去尾逗号。 */
function vonToJson(source: string): string {
    let s = source.replace(/\/\/[^\n]*/g, '');
    s = s.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_\-]*)(\s*:)/g, '$1"$2"$3');
    s = s.replace(/,\s*([}\]])/g, '$1');
    return s;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 从 `legion.von` 源码提取唯一的 build target。
 *
 * 只接受结构可确定的 manifest：`build[]` 必须是非空数组，且每个条目都显式声明
 * 非空字符串 `target`；多个不同 target 视为语义歧义，直接结构化失败，不取第一条。
 */
export function readManifestTargetDeclarationFromSource(source: string, manifestPath: string): string {
    let parsed: unknown;
    try {
        parsed = JSON.parse(vonToJson(source));
    } catch (error) {
        throw new CompileTargetPlanError('manifest_unparsable', manifestPath, `legion.von JSON 投影失败: ${String(error)}`);
    }
    if (!isRecord(parsed)) {
        throw new CompileTargetPlanError('manifest_unparsable', manifestPath, 'legion.von 顶层不是对象');
    }
    const build = parsed.build;
    if (!Array.isArray(build) || build.length === 0) {
        throw new CompileTargetPlanError('manifest_target_missing', manifestPath, '未声明 build[] 或 build 为空');
    }
    const declared: string[] = [];
    for (const [index, entry] of build.entries()) {
        if (!isRecord(entry)) {
            throw new CompileTargetPlanError('manifest_target_missing', manifestPath, `build[${index}] 不是对象`);
        }
        const target = entry.target;
        if (typeof target !== 'string' || target.trim().length === 0) {
            throw new CompileTargetPlanError(
                'manifest_target_missing',
                manifestPath,
                `build[${index}].target 缺失或不是非空字符串`,
            );
        }
        declared.push(target.trim());
    }
    const unique = [...new Set(declared)];
    if (unique.length > 1) {
        throw new CompileTargetPlanError(
            'manifest_target_ambiguous',
            manifestPath,
            `build[] 声明了多个不同 target（${unique.join(', ')}），无法确定唯一 compile target`,
        );
    }
    return unique[0]!;
}

/** 读取 solver 目录的 `legion.von` 并提取唯一 build target 声明。 */
export function readManifestTargetDeclaration(solverDir: string): { manifestPath: string; declaredTarget: string } {
    const manifestPath = join(solverDir, 'legion.von');
    if (!existsSync(manifestPath)) {
        throw new CompileTargetPlanError('manifest_missing', manifestPath, 'legion.von 不存在');
    }
    let source: string;
    try {
        source = readFileSync(manifestPath, 'utf8');
    } catch (error) {
        throw new CompileTargetPlanError('manifest_unparsable', manifestPath, `读取失败: ${String(error)}`);
    }
    return { manifestPath, declaredTarget: readManifestTargetDeclarationFromSource(source, manifestPath) };
}

/**
 * 用 `legionPlan` 把声明 target 规范化为 canonical triple。
 * 计划失败时不猜默认值，直接抛 {@link CompileTargetPlanError}。
 */
function resolvePlan(
    solverDir: string,
    manifestPath: string,
    source: CompileTargetPlanSource,
    declaredTarget: string,
): CompileTargetPlan {
    const outcome = legionPlanProject(solverDir, declaredTarget);
    if (!outcome?.ok) {
        const detail = typeof outcome?.error === 'string' && outcome.error.length > 0 ? outcome.error : 'legion plan 失败';
        throw new CompileTargetPlanError('plan_failed', manifestPath, detail);
    }
    if (typeof outcome.target !== 'string' || outcome.target.trim().length === 0) {
        throw new CompileTargetPlanError('plan_target_missing', manifestPath, 'legion plan 未返回 canonical target');
    }
    return {
        solverDir,
        manifestPath,
        source,
        declaredTarget,
        canonicalTarget: outcome.target.trim(),
    };
}

/** 解析 manifest 声明的 compile target 计划（wasm 交付 lane 使用）。 */
export function resolveCompileTargetPlan(solverDir: string): CompileTargetPlan {
    const { manifestPath, declaredTarget } = readManifestTargetDeclaration(solverDir);
    return resolvePlan(solverDir, manifestPath, 'manifest', declaredTarget);
}

/**
 * 解析 lane 显式指定的 compile target 计划（legacy OVM lane 使用）。
 * 该 lane 的 target 不由 manifest 声明决定，因此来源显式记为 `lane-explicit`。
 */
export function resolveLaneTargetPlan(solverDir: string, target: string): CompileTargetPlan {
    if (target.trim().length === 0) {
        throw new CompileTargetPlanError('plan_target_missing', join(solverDir, 'legion.von'), 'lane target 为空');
    }
    return resolvePlan(solverDir, join(solverDir, 'legion.von'), 'lane-explicit', target.trim());
}
