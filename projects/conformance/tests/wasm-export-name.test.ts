/**
 * 导出名大小写归一化：只在精确匹配失败时接受唯一大小写变体，歧义一律失败。
 */
import { describe, expect, it } from 'vitest';

import { matchWasmExportSymbol } from '../src/adapters/valkyrie-node/abi.ts';

describe('wasm export 名归一化', () => {
    it('精确匹配优先', () => {
        expect(matchWasmExportSymbol('preimageSizeFZF', ['preimageSizeFZF', 'main'])).toEqual({
            symbol: 'preimageSizeFZF',
            caseInsensitive: false,
        });
    });

    it('精确失败时接受唯一大小写变体（缩写被 camelCase 压平）', () => {
        expect(matchWasmExportSymbol('preimageSizeFZF', ['preimageSizeFzf', 'main'])).toEqual({
            symbol: 'preimageSizeFzf',
            caseInsensitive: true,
        });
    });

    it('多个大小写候选 → 歧义，不猜', () => {
        expect(matchWasmExportSymbol('TwoSum', ['twoSum', 'twosum'])).toBeNull();
    });

    it('无任何候选 → null', () => {
        expect(matchWasmExportSymbol('missing', ['main'])).toBeNull();
    });
});
