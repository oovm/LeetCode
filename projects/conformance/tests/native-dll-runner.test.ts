import { describe, expect, it } from 'vitest';

import {
    DLL_REPRESENTATIVE_IDS,
    DllIdentityError,
    consumerStageToFailureStage,
    dllCarrierBlocker,
    dllSignatureBlocker,
    resolveDllExportName,
    type DllExportDeclaration,
} from '../src/adapters/valkyrie-backend/native-dll-runner.ts';
import { ValkyrieEntryContractError } from '../src/adapters/valkyrie-node/ref.ts';

function declaration(overrides: Partial<DllExportDeclaration> = {}): DllExportDeclaration {
    return {
        sourceName: 'sum',
        logicalName: 'sum',
        physicalArtifact: 'app.dll',
        abi: 'c-abi',
        signatureAvailable: true,
        parameters: ['i64', 'i64'],
        parameterNames: ['a', 'b'],
        returns: 'i64',
        ...overrides,
    };
}

/**
 * `native-dll` lane 的入口身份合同。
 *
 * 清单是唯一导出表：入口必须与稳定导出身份或目标公开名逐字唯一匹配，
 * 没有换算、没有「只有一个导出就调用」的回退。
 */
describe('C ABI 清单导出严格消费', () => {
    const exports = [declaration({ sourceName: 'my_sqrt', logicalName: 'my_sqrt' }), declaration({ sourceName: 'reverse', logicalName: 'reverse' })];

    it('入口与源码名逐字匹配时返回该公开名', () => {
        expect(resolveDllExportName(exports, { valkyrie: 'my_sqrt' })).toBe('my_sqrt');
        expect(resolveDllExportName(exports, { valkyrie: 'reverse' })).toBe('reverse');
    });

    it('反例：入口写成 Node 的 camelCase 名必须失败，不做换算或回退', () => {
        expect(() => resolveDllExportName(exports, { valkyrie: 'mySqrt' })).toThrow(DllIdentityError);
        expect(() => resolveDllExportName(exports, { valkyrie: 'mySqrt' })).toThrow(/不一致/);
    });

    it('单导出但入口写错同样失败，不调用唯一导出', () => {
        const single = [declaration({ sourceName: 'my_sqrt', logicalName: 'my_sqrt' })];
        expect(() => resolveDllExportName(single, { valkyrie: 'mySqrt' })).toThrow(DllIdentityError);
    });

    it('清单重复同一导出身份视为合同破坏', () => {
        const duplicated = [...exports, declaration({ sourceName: 'reverse', logicalName: 'reverse' })];
        expect(() => resolveDllExportName(duplicated, { valkyrie: 'reverse' })).toThrow(/重复声明/);
    });

    it('缺失 invoke.valkyrie 仍是结构化入口合同错误', () => {
        expect(() => resolveDllExportName(exports, { typescript: 'Solution().mySqrt' })).toThrow(ValkyrieEntryContractError);
    });
});

/**
 * 冻结签名是调用前提：签名不可用、形参与名数量不符、载体未实现时，
 * 在进入 FFI 之前结构化拒绝；零形参是合法签名。
 */
describe('C ABI 冻结签名合同', () => {
    it('i64、bool 与混合浮点签名都在已实现集合内', () => {
        expect(dllSignatureBlocker(declaration())).toBeNull();
        expect(dllSignatureBlocker(declaration({ parameters: ['bool'], parameterNames: ['flag'], returns: 'bool' }))).toBeNull();
        expect(
            dllSignatureBlocker(
                declaration({ parameters: ['i64', 'f64', 'f64'], parameterNames: ['n', 'x', 'y'], returns: 'f64' }),
            ),
        ).toBeNull();
    });

    it('零形参是合法签名，与签名不可用可区分', () => {
        expect(dllSignatureBlocker(declaration({ parameters: [], parameterNames: [], returns: 'i64' }))).toBeNull();
        expect(dllSignatureBlocker(declaration({ signatureAvailable: false }))).toMatch(/没有冻结的 C ABI 签名/);
    });

    it('未实现的载体组合在进入 FFI 前拒绝', () => {
        expect(dllSignatureBlocker(declaration({ parameters: ['utf8'], parameterNames: ['text'] }))).toMatch(/不在已实现的 C ABI 标量集合内/);
        expect(dllSignatureBlocker(declaration({ returns: 'i64[]' }))).toMatch(/不在已实现的 C ABI 标量集合内/);
    });

    it('形参载体与声明名数量不符视为清单破坏', () => {
        expect(dllSignatureBlocker(declaration({ parameterNames: ['a'] }))).toMatch(/数量不一致/);
    });
});

describe('C ABI 用例载体', () => {
    it('签名决定实参与返回载体：i64 / bool / 混合浮点', () => {
        expect(dllCarrierBlocker(declaration(), [19, 23], 42, false)).toBeNull();
        expect(dllCarrierBlocker(declaration({ parameters: ['bool'], parameterNames: ['flag'], returns: 'bool' }), [true], false, false)).toBeNull();
        expect(
            dllCarrierBlocker(
                declaration({ parameters: ['i64', 'f64', 'f64'], parameterNames: ['n', 'x', 'y'], returns: 'f64' }),
                [3, 1.5, 2.5],
                7.5,
                false,
            ),
        ).toBeNull();
        expect(dllCarrierBlocker(declaration(), ['9007199254740993', '1'], '9007199254740994', false)).toBeNull();
    });

    it('实参形状与冻结载体不符时按载体缺口拦截', () => {
        expect(dllCarrierBlocker(declaration(), [[1, 2, 3], 1], 1, false)).toMatch(/不是整数载体|文本载体/);
        expect(dllCarrierBlocker(declaration(), [1.5, 1], 1, false)).toMatch(/安全整数范围/);
        expect(dllCarrierBlocker(declaration({ returns: 'f64' }), [1, 2], '1', false)).toMatch(/不是浮点载体/);
        expect(dllCarrierBlocker(declaration({ returns: 'bool' }), [1, 2], 1, false)).toMatch(/不是布尔载体/);
    });

    it('实参数量与冻结签名不一致时拒绝', () => {
        expect(dllCarrierBlocker(declaration(), [1], 1, false)).toMatch(/数量/);
        expect(dllCarrierBlocker(declaration(), [1, 2, 3], 1, false)).toMatch(/数量/);
    });

    it('空期望只在 unit 返回时放行', () => {
        expect(dllCarrierBlocker(declaration({ returns: 'unit' }), [1, 2], null, false)).toBeNull();
        expect(dllCarrierBlocker(declaration(), [1, 2], null, false)).toMatch(/原地写回/);
    });

    it('guest 异常通道未定案时拦截', () => {
        expect(dllCarrierBlocker(declaration(), [1, 2], 'Error: boom', true)).toMatch(/异常通道/);
    });

    it('超出 i64 域的整数不静默截断', () => {
        expect(dllCarrierBlocker(declaration(), ['9223372036854775808', '1'], 1, false)).toMatch(/超出 i64 域/);
        expect(dllCarrierBlocker(declaration(), [2n ** 63n, 1n], 1, false)).toMatch(/超出 i64 域/);
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
