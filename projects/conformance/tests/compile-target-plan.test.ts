import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
    CompileTargetPlanError,
    readManifestTargetDeclarationFromSource,
} from '../src/adapters/shared/compile-target-plan.ts';

const MANIFEST = 'legion.von';

function expectPlanError(run: () => unknown, code: CompileTargetPlanError['code']): void {
    try {
        run();
    } catch (error) {
        expect(error).toBeInstanceOf(CompileTargetPlanError);
        expect((error as CompileTargetPlanError).code).toBe(code);
        return;
    }
    throw new Error(`expected CompileTargetPlanError(${code})`);
}

describe('legion.von compile target 声明', () => {
    it('接受唯一 build target，忽略行注释与尾逗号', () => {
        const source = [
            '{',
            '    name: "two-sum",',
            '    dependencies: { core: true, std: true },',
            '    build: [',
            '        { target: "wasm" }, // 中性 Wasm',
            '    ]',
            '}',
        ].join('\n');
        expect(readManifestTargetDeclarationFromSource(source, MANIFEST)).toBe('wasm');
    });

    it('读取仓库内真实题解的 legion.von', () => {
        const manifestPath = fileURLToPath(
            new URL('../../problems/two-sum/solvers/valkyrie/legion.von', import.meta.url),
        );
        const source = readFileSync(manifestPath, 'utf8');
        expect(readManifestTargetDeclarationFromSource(source, 'legion.von')).toBe('wasm');
    });

    it('多个条目声明同一 target 时仍可唯一确定', () => {
        const source = '{ build: [{ target: "wasm" }, { target: "wasm" }] }';
        expect(readManifestTargetDeclarationFromSource(source, MANIFEST)).toBe('wasm');
    });

    it('缺少 build[] 时结构化失败而不是默认 wasm', () => {
        expectPlanError(
            () => readManifestTargetDeclarationFromSource('{ name: "two-sum" }', MANIFEST),
            'manifest_target_missing',
        );
    });

    it('build[] 为空时结构化失败', () => {
        expectPlanError(
            () => readManifestTargetDeclarationFromSource('{ build: [] }', MANIFEST),
            'manifest_target_missing',
        );
    });

    it('build 条目缺少 target 时结构化失败并指出下标', () => {
        try {
            readManifestTargetDeclarationFromSource('{ build: [{ entry: "solution.v" }] }', MANIFEST);
            throw new Error('expected failure');
        } catch (error) {
            expect(error).toBeInstanceOf(CompileTargetPlanError);
            expect((error as CompileTargetPlanError).code).toBe('manifest_target_missing');
            expect((error as Error).message).toContain('build[0]');
        }
    });

    it('多个不同 target 视为歧义，不取第一条', () => {
        expectPlanError(
            () => readManifestTargetDeclarationFromSource('{ build: [{ target: "wasm" }, { target: "ovm" }] }', MANIFEST),
            'manifest_target_ambiguous',
        );
    });

    it('JSON 投影失败时结构化失败', () => {
        expectPlanError(
            () => readManifestTargetDeclarationFromSource('{ build: [{ target: "wasm" }] } trailing', MANIFEST),
            'manifest_unparsable',
        );
        expectPlanError(() => readManifestTargetDeclarationFromSource('[]', MANIFEST), 'manifest_unparsable');
    });
});
