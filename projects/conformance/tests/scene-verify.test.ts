import { describe, expect, it } from 'vitest';

import type { LibraryInvokeSchema } from '../src/adapters/valkyrie-node/abi.ts';
import { digestOf } from '../src/observation/case-identity.ts';
import { classifyThrown } from '../src/observation/guest-trap.ts';
import { formatSceneCaseLine, runSceneCase, type SceneCase, type SceneInvokeHost } from '../src/observation/scene-verify.ts';

function schemaWith(exports: LibraryInvokeSchema['exports']): LibraryInvokeSchema {
    return { version: 0, exports, abi_digest: 'test' };
}

const I32_EXPORT = schemaWith({ run: { params: [], returns: { kind: 'I32' } } });

function hostReturning(value: unknown): SceneInvokeHost {
    return { callExport: () => value };
}

function hostThrowing(err: unknown): SceneInvokeHost {
    return {
        callExport: () => {
            throw err;
        },
    };
}

function testCase(overrides: Partial<SceneCase> = {}): SceneCase {
    return { export: 'run', expected: 3, ...overrides };
}

describe('guest trap 分类', () => {
    it('WebAssembly.RuntimeError 在 invoke 窗口内是明确 guest trap', () => {
        const classified = classifyThrown(new WebAssembly.RuntimeError('unreachable'), 'guest-invoke');
        expect(classified.kind).toBe('guest-trap');
        if (classified.kind === 'guest-trap') {
            expect(classified.trapKind).toBe('wasm-runtime-error');
            expect(classified.reason).toBe('unreachable');
        }
    });

    it('host_raise 栈帧是 guest raise，携带 guest 文本原因', () => {
        const err = new Error('division by zero');
        err.stack = 'Error: division by zero\n    at host_raise (file:///glue.mjs:20:40)\n    at wasm-function[3]:0x123';
        const classified = classifyThrown(err, 'guest-invoke');
        expect(classified.kind).toBe('guest-trap');
        if (classified.kind === 'guest-trap') {
            expect(classified.trapKind).toBe('guest-raise');
            expect(classified.reason).toBe('division by zero');
        }
    });

    it('JS TypeError 是宿主侧异常，永不判为 guest trap', () => {
        const classified = classifyThrown(new TypeError('x is not a function'), 'guest-invoke');
        expect(classified.kind).toBe('host-anomaly');
        if (classified.kind === 'host-anomaly') {
            expect(classified.phase).toBe('guest-invoke');
        }
    });

    it('glue 的 Cannot demarshal 异常修正阶段到 demarshal-normalize', () => {
        const err = new Error('[wasm-js-glue]/args: Cannot demarshal I64 from 3: expected a BigInt (the wasm i64 carrier).');
        const classified = classifyThrown(err, 'guest-invoke');
        expect(classified.kind).toBe('host-anomaly');
        if (classified.kind === 'host-anomaly') {
            expect(classified.phase).toBe('demarshal-normalize');
        }
    });

    it('glue 的 Cannot marshal 异常修正阶段到 marshal', () => {
        const err = new Error('[wasm-js-glue]/args: Cannot marshal I32 from "x": expected an integer number.');
        const classified = classifyThrown(err, 'guest-invoke');
        expect(classified.kind).toBe('host-anomaly');
        if (classified.kind === 'host-anomaly') {
            expect(classified.phase).toBe('marshal');
        }
    });
});

describe('case 内容摘要', () => {
    it('键序不影响摘要', () => {
        expect(digestOf({ a: 1, b: { c: 2, d: [3, 'x'] } })).toBe(digestOf({ b: { d: [3, 'x'], c: 2 }, a: 1 }));
    });

    it('内容不同摘要不同', () => {
        expect(digestOf({ expected: 3 })).not.toBe(digestOf({ expected: 4 }));
    });
});

describe('场景用例分阶段观测', () => {
    it('expected trap + 明确 guest trap → 通过，demarshal 相位记 skipped', async () => {
        const result = await runSceneCase(hostThrowing(new WebAssembly.RuntimeError('unreachable')), I32_EXPORT, 'panic-traps', testCase({ expected: 'trap' }));
        expect(result.verdict).toBe('pass');
        expect(result.caseId).toBe('panic-traps::run');
        expect(result.phases.invoke.status).toBe('guest-trap');
        expect(result.phases.demarshal.status).toBe('skipped');
    });

    it('expected trap + 宿主侧 TypeError → 失败且标记 HOST-ANOMALY，不判为通过', async () => {
        const result = await runSceneCase(hostThrowing(new TypeError('bad glue')), I32_EXPORT, 'panic-traps', testCase({ expected: 'trap' }));
        expect(result.verdict).toBe('fail');
        expect(result.failure).toContain('HOST-ANOMALY');
        expect(result.phases.invoke.status).toBe('host-anomaly');
    });

    it('expected trap + glue demarshal 异常 → 失败并归 demarshal-normalize 阶段', async () => {
        const result = await runSceneCase(
            hostThrowing(new Error('[wasm-js-glue]/ret: Cannot demarshal I64 from 3: expected a BigInt')),
            I32_EXPORT,
            'panic-traps',
            testCase({ expected: 'trap' }),
        );
        expect(result.verdict).toBe('fail');
        expect(result.phases.demarshal.status).toBe('host-anomaly');
        expect(result.phases.invoke.status).toBe('skipped');
    });

    it('期望数值 + guest trap → 失败（unexpected guest trap）', async () => {
        const result = await runSceneCase(hostThrowing(new WebAssembly.RuntimeError('unreachable')), I32_EXPORT, 'string-escape-quote', testCase());
        expect(result.verdict).toBe('fail');
        expect(result.failure).toContain('unexpected guest trap');
    });

    it('期望数值但正常返回 → 失败（expected trap, got value）', async () => {
        const result = await runSceneCase(hostReturning(3), I32_EXPORT, 'panic-traps', testCase({ expected: 'trap' }));
        expect(result.verdict).toBe('fail');
        expect(result.failure).toContain('expected trap');
    });

    it('值匹配 → 通过，三阶段各自独立为 ok', async () => {
        const result = await runSceneCase(hostReturning(3), I32_EXPORT, 'string-escape-quote', testCase());
        expect(result.verdict).toBe('pass');
        expect(result.phases).toEqual({
            marshal: { status: 'ok' },
            invoke: { status: 'ok' },
            demarshal: { status: 'ok' },
        });
    });

    it('值不匹配 → 失败并携带 expected/got', async () => {
        const result = await runSceneCase(hostReturning(92), I32_EXPORT, 'escape-decode-wasm', testCase({ expected: 13 }));
        expect(result.verdict).toBe('fail');
        expect(result.failure).toContain('expected "13"');
        expect(result.phases.demarshal.status).toBe('mismatch');
    });

    it('schema 缺导出 → marshal 阶段 host-anomaly', async () => {
        const result = await runSceneCase(hostReturning(3), schemaWith({}), 'csv-tsv-parser', testCase());
        expect(result.verdict).toBe('fail');
        expect(result.phases.marshal.status).toBe('host-anomaly');
        expect(result.phases.invoke.status).toBe('skipped');
    });

    it('逐例结果行携带 caseId 与摘要前缀', async () => {
        const result = await runSceneCase(hostReturning(3), I32_EXPORT, 'json-roundtrip', testCase());
        const line = formatSceneCaseLine(result);
        expect(line).toContain('PASS json-roundtrip::run digest=');
        expect(line).toContain('marshal=ok invoke=ok demarshal=ok');
    });
});
