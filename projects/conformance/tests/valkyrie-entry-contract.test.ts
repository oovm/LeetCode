import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
    loadMetadata,
    requireValkyrieInvokeEntry,
    resolveWasmExportSymbol,
    ValkyrieEntryContractError,
} from '../src/adapters/valkyrie-node/ref.ts';

function writeProblemMetadata(id: string, invoke: Record<string, string>): string {
    const dir = mkdtempSync(join(tmpdir(), 'leetcode-v-entry-'));
    writeFileSync(
        join(dir, 'metadata.json'),
        JSON.stringify({ id, tests: [{ args: {}, expected: null }], invoke }, null, 4),
        'utf8',
    );
    return dir;
}

describe('Valkyrie entry contract', () => {
    it('selects `metadata.invoke.valkyrie` instead of the TypeScript entry', () => {
        const dir = writeProblemMetadata('not-two-sum', { valkyrie: 'compute', typescript: 'Solution().compute' });
        const { invoke } = loadMetadata(dir);
        expect(requireValkyrieInvokeEntry(invoke)).toBe('compute');
    });

    it('resolves the bare emitter export key and the receiver form identically', () => {
        expect(resolveWasmExportSymbol('twoSum')).toBe('twoSum');
        expect(resolveWasmExportSymbol('Solution().twoSum')).toBe('twoSum');
    });

    it('throws a structured entry contract error when `invoke.valkyrie` is missing', () => {
        const dir = writeProblemMetadata('two-sum', {
            python: 'Solution().twoSum',
            typescript: 'Solution().twoSum',
        });
        const { invoke } = loadMetadata(dir);
        expect(invoke.valkyrie).toBeUndefined();

        let caught: unknown;
        try {
            requireValkyrieInvokeEntry(invoke);
        } catch (err) {
            caught = err;
        }
        expect(caught).toBeInstanceOf(ValkyrieEntryContractError);
        expect((caught as ValkyrieEntryContractError).code).toBe('valkyrie_entry_contract_failure');
        expect((caught as Error).message).toContain('entry contract failure');
    });

    it('does not derive the entry from the problem id', () => {
        const missing = writeProblemMetadata('two-sum', { typescript: 'Solution().twoSum' });
        expect(() => requireValkyrieInvokeEntry(loadMetadata(missing).invoke)).toThrow(ValkyrieEntryContractError);

        const present = writeProblemMetadata('some-other-slug', {
            valkyrie: 'compute',
            typescript: 'Solution().compute',
        });
        expect(requireValkyrieInvokeEntry(loadMetadata(present).invoke)).toBe('compute');
    });
});
