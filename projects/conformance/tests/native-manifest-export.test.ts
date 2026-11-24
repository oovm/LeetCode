import { describe, expect, it } from 'vitest';

import {
    bindNativeArguments,
    parseNativeManifestExports,
    resolveManifestExportName,
    strictNativeMatch,
} from '../src/adapters/valkyrie-backend/native-runner.ts';
import { ValkyrieEntryContractError } from '../src/adapters/valkyrie-node/ref.ts';

/**
 * 题库 runner 对执行清单导出表的严格消费合同。
 *
 * 逻辑入口必须与清单公开名逐字精确匹配且唯一：无大小写启发式换算、
 * 无「只有一个导出就调用」的回退，防止把错误导出跑成假绿。
 */
describe('原生清单导出严格消费', () => {
    it('逻辑入口与清单公开名精确唯一匹配', () => {
        expect(resolveManifestExportName(['moveZeroes', 'twoSum'], { valkyrie: 'twoSum' })).toBe('twoSum');
    });

    it('反例：单导出但入口写错必须失败，不回退调用唯一导出', () => {
        expect(() => resolveManifestExportName(['moveZeroes'], { valkyrie: 'move_zeroes' })).toThrow(/唯一匹配/);
    });

    it('不做 wasm 命名启发式：入口原样比对，不换算大小写或接收者形态', () => {
        expect(() => resolveManifestExportName(['moveZeroes'], { valkyrie: 'Solution().moveZeroes' })).toThrow(/唯一匹配/);
        expect(() => resolveManifestExportName(['move_zeroes'], { valkyrie: 'moveZeroes' })).toThrow(/唯一匹配/);
    });

    it('清单重复声明同一公开名视为合同破坏', () => {
        expect(() => resolveManifestExportName(['twoSum', 'twoSum'], { valkyrie: 'twoSum' })).toThrow(/重复声明/);
    });

    it('空清单导出表失败', () => {
        expect(() => resolveManifestExportName([], { valkyrie: 'twoSum' })).toThrow(/唯一匹配/);
    });

    it('缺失 invoke.valkyrie 仍是结构化入口合同错误', () => {
        expect(() => resolveManifestExportName(['twoSum'], { typescript: 'Solution().twoSum' })).toThrow(ValkyrieEntryContractError);
    });
});

/**
 * 清单载体的完整性与按名绑定。
 *
 * 完整签名（ABI / 签名可用 / 形参名与载体等长 / 单一 .node）是执行前提；
 * 零形参与「签名不可用」必须可区分。
 */
describe('原生清单载体合同', () => {
    const entry = (overrides: Record<string, unknown> = {}) => ({
        logical_name: 'twoSum',
        physical_artifact: 'app.node',
        abi: 'node-api',
        signature_available: true,
        parameters: ['i64[]', 'i64'],
        parameter_names: ['nums', 'target'],
        returns: 'i64[]',
        ...overrides,
    });

    it('完整签名通过并保留形参顺序', () => {
        const parsed = parseNativeManifestExports([entry()]);
        expect(parsed).not.toBeNull();
        expect(parsed!.signatures.twoSum).toEqual({
            parameters: ['i64[]', 'i64'],
            parameterNames: ['nums', 'target'],
            returns: 'i64[]',
        });
    });

    it('缺签名、未知 ABI、形参名缺失或不等长一律阻塞', () => {
        expect(parseNativeManifestExports([entry({ signature_available: false })])).toBeNull();
        expect(parseNativeManifestExports([entry({ abi: 'wasm' })])).toBeNull();
        expect(parseNativeManifestExports([entry({ parameter_names: undefined })])).toBeNull();
        expect(parseNativeManifestExports([entry({ parameter_names: ['nums'] })])).toBeNull();
        expect(parseNativeManifestExports([entry({ returns: '' })])).toBeNull();
        expect(parseNativeManifestExports([entry({ physical_artifact: 'app.wasm' })])).toBeNull();
    });

    it('零形参是合法签名，与签名不可用可区分', () => {
        const parsed = parseNativeManifestExports([entry({ parameters: [], parameter_names: [], returns: 'i64' })]);
        expect(parsed).not.toBeNull();
        expect(parsed!.signatures.twoSum.parameters).toEqual([]);
    });
});

/** 用例实参按清单形参名绑定，不依赖 JSON 键序。 */
describe('实参按名绑定', () => {
    it('键序交换后仍按声明名绑定', () => {
        expect(bindNativeArguments({ target: 9, nums: [2, 7] }, ['nums', 'target'])).toEqual([[2, 7], 9]);
    });

    it('缺字段、多余字段、非对象与数量不符都拒绝', () => {
        expect(bindNativeArguments({ nums: [2, 7] }, ['nums', 'target'])).toBeNull();
        expect(bindNativeArguments({ nums: [2, 7], target: 9, extra: 1 }, ['nums', 'target'])).toBeNull();
        expect(bindNativeArguments([2, 7], ['nums'])).toBeNull();
        expect(bindNativeArguments(null, ['nums'])).toBeNull();
    });

    it('零形参要求空实参对象', () => {
        expect(bindNativeArguments({}, [])).toEqual([]);
        expect(bindNativeArguments({ unexpected: 1 }, [])).toBeNull();
    });
});

/**
 * `"00123"` 的文本/整数反例：同一字符串在 utf8 与 i64 载体下语义不同，
 * 实际值的宿主类型必须与清单返回载体一致。
 */
describe('严格返回值比对', () => {
    it('i64 返回：实际必须是 bigint，期望按十进制解析', () => {
        expect(strictNativeMatch(123n, '00123', 'i64')).toBe(true);
        expect(strictNativeMatch(123n, 123, 'i64')).toBe(true);
        expect(strictNativeMatch('123', '00123', 'i64')).toBe(false);
        expect(strictNativeMatch(123, '00123', 'i64')).toBe(false);
    });

    it('utf8 返回：逐字比较，不做整数规整', () => {
        expect(strictNativeMatch('00123', '00123', 'utf8')).toBe(true);
        expect(strictNativeMatch('123', '00123', 'utf8')).toBe(false);
        expect(strictNativeMatch(123n, '00123', 'utf8')).toBe(false);
    });

    it('i64[] 返回：逐元素要求 bigint 与整数相等', () => {
        expect(strictNativeMatch([123n], ['00123'], 'i64[]')).toBe(true);
        expect(strictNativeMatch([123], ['00123'], 'i64[]')).toBe(false);
    });
});
