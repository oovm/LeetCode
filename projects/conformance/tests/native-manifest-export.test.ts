import { describe, expect, it } from 'vitest';

import { resolveManifestExportName } from '../src/adapters/valkyrie-backend/native-runner.ts';
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
