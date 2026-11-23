import { describe, expect, it } from 'vitest';

import {
    DLL_REPRESENTATIVE_IDS,
    DllIdentityError,
    dllCarrierBlocker,
    resolveDllExportName,
    consumerStageToFailureStage,
} from '../src/adapters/valkyrie-backend/native-dll-runner.ts';
import { ValkyrieEntryContractError } from '../src/adapters/valkyrie-node/ref.ts';

/**
 * `native-dll` lane 的入口身份与载体合同。
 *
 * 清单是唯一导出表：入口必须与稳定导出身份或目标公开名逐字唯一匹配，
 * 没有换算、没有「只有一个导出就调用」的回退；未定案载体在调用前结构化拦截。
 */
describe('C ABI 清单导出严格消费', () => {
    const exports = [
        { sourceName: 'my_sqrt', logicalName: 'my_sqrt', physicalArtifact: 'app.dll', abi: 'c-abi' },
        { sourceName: 'reverse', logicalName: 'reverse', physicalArtifact: 'app.dll', abi: 'c-abi' },
    ];

    it('入口与源码名逐字匹配时返回该公开名', () => {
        expect(resolveDllExportName(exports, { valkyrie: 'my_sqrt' })).toBe('my_sqrt');
        expect(resolveDllExportName(exports, { valkyrie: 'reverse' })).toBe('reverse');
    });

    it('反例：入口写成 Node 的 camelCase 名必须失败，不做换算或回退', () => {
        expect(() => resolveDllExportName(exports, { valkyrie: 'mySqrt' })).toThrow(DllIdentityError);
        expect(() => resolveDllExportName(exports, { valkyrie: 'mySqrt' })).toThrow(/不一致/);
    });

    it('单导出但入口写错同样失败，不调用唯一导出', () => {
        const single = [{ sourceName: 'my_sqrt', logicalName: 'my_sqrt', physicalArtifact: 'app.dll', abi: 'c-abi' }];
        expect(() => resolveDllExportName(single, { valkyrie: 'mySqrt' })).toThrow(DllIdentityError);
    });

    it('清单重复同一导出身份视为合同破坏', () => {
        const duplicated = [...exports, { sourceName: 'reverse', logicalName: 'reverse', physicalArtifact: 'app.dll', abi: 'c-abi' }];
        expect(() => resolveDllExportName(duplicated, { valkyrie: 'reverse' })).toThrow(/重复声明/);
    });

    it('缺失 invoke.valkyrie 仍是结构化入口合同错误', () => {
        expect(() => resolveDllExportName(exports, { typescript: 'Solution().mySqrt' })).toThrow(ValkyrieEntryContractError);
    });
});

describe('C ABI 载体合同', () => {
    it('i64 标量实参与返回进入执行门', () => {
        expect(dllCarrierBlocker([-123], 321, false)).toBeNull();
        expect(dllCarrierBlocker([10, 3], 3, false)).toBeNull();
        expect(dllCarrierBlocker(['9007199254740993'], '9007199254740993', false)).toBeNull();
    });

    it('数组、文本、布尔、浮点实参按载体缺口拦截', () => {
        expect(dllCarrierBlocker([[1, 2, 3]], 1, false)).toMatch(/数组载体/);
        expect(dllCarrierBlocker(['abc'], 1, false)).toMatch(/文本载体/);
        expect(dllCarrierBlocker([true], 1, false)).toMatch(/布尔载体/);
        expect(dllCarrierBlocker([1.5], 1, false)).toMatch(/浮点载体/);
    });

    it('数组、文本、布尔、空期望返回按载体缺口拦截', () => {
        expect(dllCarrierBlocker([1], [1, 2], false)).toMatch(/返回数组载体/);
        expect(dllCarrierBlocker([1], 'abc', false)).toMatch(/返回文本载体/);
        expect(dllCarrierBlocker([1], true, false)).toMatch(/返回布尔载体/);
        expect(dllCarrierBlocker([1], null, false)).toMatch(/原地写回/);
    });

    it('guest 异常通道未定案时拦截', () => {
        expect(dllCarrierBlocker([1], 'Error: boom', true)).toMatch(/异常通道/);
    });

    it('超出 i64 域的整数不静默截断', () => {
        expect(dllCarrierBlocker(['9223372036854775808'], 1, false)).toMatch(/超出 i64 域/);
        expect(dllCarrierBlocker([2n ** 63n], 1, false)).toMatch(/超出 i64 域/);
    });
});

describe('消费者阶段映射', () => {
    it('call 阶段是装载成功后的调用失败', () => {
        expect(consumerStageToFailureStage('call')).toBe('execute');
        expect(consumerStageToFailureStage('load')).toBe('load');
        expect(consumerStageToFailureStage('symbol')).toBe('symbol');
        expect(consumerStageToFailureStage('abi')).toBe('abi');
    });
});

describe('代表题集', () => {
    it('包含一道内部使用集合、公开接口为标量的题', () => {
        expect(DLL_REPRESENTATIVE_IDS).toContain('android-unlock-patterns');
    });

    it('代表题没有重复身份', () => {
        expect(new Set(DLL_REPRESENTATIVE_IDS).size).toBe(DLL_REPRESENTATIVE_IDS.length);
    });
});
