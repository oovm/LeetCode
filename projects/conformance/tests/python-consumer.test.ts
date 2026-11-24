import { describe, expect, it } from 'vitest';

import {
    decodePythonResult,
    parsePythonManifestExports,
    strictPythonMatch,
} from '../src/adapters/valkyrie-python/runner.ts';

function declaration(overrides: Record<string, unknown> = {}) {
    return {
        logical_name: 'multiply',
        source_name: 'multiply',
        physical_artifact: 'leetcode_multiply_strings.cp312-win_amd64.pyd',
        abi: 'cpython',
        signature_available: true,
        parameters: ['utf8', 'utf8'],
        parameter_names: ['num1', 'num2'],
        returns: 'utf8',
        module_name: 'leetcode_multiply_strings',
        ...overrides,
    };
}

describe('parsePythonManifestExports', () => {
    it('接受完整的多导出 CPython 清单并冻结同一模块名', () => {
        const parsed = parsePythonManifestExports([
            declaration(),
            declaration({
                logical_name: 'move_zeroes',
                source_name: 'move_zeroes',
                parameters: ['i64'],
                parameter_names: ['x'],
                returns: 'i64',
            }),
        ]);
        expect(parsed).not.toBeNull();
        expect(parsed!.moduleName).toBe('leetcode_multiply_strings');
        expect(parsed!.physicalArtifact).toBe('leetcode_multiply_strings.cp312-win_amd64.pyd');
        expect(parsed!.exports.map((entry) => entry.logicalName)).toEqual(['multiply', 'move_zeroes']);
        expect(parsed!.exports[0]!.parameterNames).toEqual(['num1', 'num2']);
    });

    it('缺模块名、缺签名或未知 ABI 时整体拒绝', () => {
        expect(parsePythonManifestExports([declaration({ module_name: '' })])).toBeNull();
        expect(parsePythonManifestExports([declaration({ signature_available: false })])).toBeNull();
        expect(parsePythonManifestExports([declaration({ abi: 'node-api' })])).toBeNull();
    });

    it('形参名与形参标签不等长或重复时拒绝', () => {
        expect(parsePythonManifestExports([declaration({ parameter_names: ['num1'] })])).toBeNull();
        expect(parsePythonManifestExports([declaration({ parameter_names: ['num1', 'num1'] })])).toBeNull();
    });

    it('物理产物不是扩展文件或导出名重复时拒绝', () => {
        expect(parsePythonManifestExports([declaration({ physical_artifact: 'app.dll' })])).toBeNull();
        const duplicated = [
            declaration(),
            declaration({ logical_name: 'multiply', source_name: 'multiply_again' }),
        ];
        expect(parsePythonManifestExports(duplicated)).toBeNull();
    });

    it('零形参是已冻结签名而不是缺签名', () => {
        const parsed = parsePythonManifestExports([
            declaration({ parameters: [], parameter_names: [], returns: 'i64' }),
        ]);
        expect(parsed).not.toBeNull();
        expect(parsed!.exports[0]!.parameters).toEqual([]);
    });
});

describe('strictPythonMatch', () => {
    it('i64 必须实际是 bigint，期望十进制字面量按整数解析', () => {
        expect(strictPythonMatch(123n, 123, 'i64')).toBe(true);
        expect(strictPythonMatch(123n, '00123', 'i64')).toBe(true);
        expect(strictPythonMatch('123', '123', 'i64')).toBe(false);
        expect(strictPythonMatch(9007199254740993n, '9007199254740993', 'i64')).toBe(true);
    });

    it('utf8 逐字比较，不把整数规整成文本', () => {
        expect(strictPythonMatch('00123', '00123', 'utf8')).toBe(true);
        expect(strictPythonMatch(123n, '00123', 'utf8')).toBe(false);
        expect(strictPythonMatch('123', '00123', 'utf8')).toBe(false);
    });

    it('bool / f64 / unit / i64[] 按载体严格比较', () => {
        expect(strictPythonMatch(true, true, 'bool')).toBe(true);
        expect(strictPythonMatch(1, true, 'bool')).toBe(false);
        expect(strictPythonMatch(10.5, 10.5, 'f64')).toBe(true);
        expect(strictPythonMatch('10.5', 10.5, 'f64')).toBe(false);
        expect(strictPythonMatch(null, null, 'unit')).toBe(true);
        expect(strictPythonMatch(undefined, null, 'unit')).toBe(false);
        expect(strictPythonMatch([1n, 2n], [1, 2], 'i64[]')).toBe(true);
        expect(strictPythonMatch([1n, '2'], [1, 2], 'i64[]')).toBe(false);
    });
});

describe('decodePythonResult', () => {
    it('把消费者编码还原成严格比对用值', () => {
        expect(decodePythonResult({ ok: true, kind: 'i64', value: '-42' })).toBe(-42n);
        expect(decodePythonResult({ ok: true, kind: 'i64[]', value: ['1', '2'] })).toEqual([1n, 2n]);
        expect(decodePythonResult({ ok: true, kind: 'f64', value: '10.5' })).toBe(10.5);
        expect(decodePythonResult({ ok: true, kind: 'utf8', value: '00123' })).toBe('00123');
        expect(decodePythonResult({ ok: true, kind: 'bool', value: false })).toBe(false);
        expect(decodePythonResult({ ok: true, kind: 'unit' })).toBeNull();
    });

    it('拒绝载体与编码不一致的返回值', () => {
        expect(() => decodePythonResult({ ok: true, kind: 'i64', value: 'abc' })).toThrow();
        expect(() => decodePythonResult({ ok: true, kind: 'utf8', value: 1 as unknown as string })).toThrow();
        expect(() => decodePythonResult({ ok: true, kind: 'unknown', value: 1 })).toThrow();
    });
});
