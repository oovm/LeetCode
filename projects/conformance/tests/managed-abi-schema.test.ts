/**
 * managed ABI schema 4 消费合同：摘要文本与 Rust `canonical_digest_input` 逐字节一致，
 * `parameter_names` / `source_name` / 可空 `launcher_class` 严格校验，旧 schema 拒绝。
 */
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
    computeManagedContractDigest,
    ManagedAbiError,
    readManagedAbiContract,
    type ManagedAbiContract,
    type ManagedAbiEntry,
} from '../src/adapters/valkyrie-backend/managed-abi.ts';

function entry(overrides: Partial<ManagedAbiEntry> = {}): ManagedAbiEntry {
    return {
        logical_entry: 'sum',
        source_name: 'two_sum',
        owner: 'nyar/App',
        method: 'sum',
        signature: '(JJ)J',
        parameter_types: ['i64', 'i64'],
        parameter_names: ['left', 'right'],
        return_type: 'i64',
        launcher_class: 'nyar/invoke/sum',
        ...overrides,
    };
}

function contract(overrides: Partial<Omit<ManagedAbiContract, 'contract_digest'>> = {}): Omit<ManagedAbiContract, 'contract_digest'> {
    return {
        schema_version: 4,
        lane: 'jvm',
        artifact: 'app.jar',
        calling_convention: 'static-argv-launcher',
        entries: [entry()],
        ...overrides,
    };
}

const tempDirs: string[] = [];

function writeSidecar(payload: Record<string, unknown>): string {
    const dir = mkdtempSync(join(tmpdir(), 'managed-abi-'));
    tempDirs.push(dir);
    writeFileSync(join(dir, 'app.jar.managed-abi.json'), JSON.stringify(payload), 'utf8');
    return dir;
}

function sealed(payload: Record<string, unknown>): Record<string, unknown> {
    const base = contract();
    const merged = { ...base, ...payload } as Omit<ManagedAbiContract, 'contract_digest'>;
    return { ...merged, contract_digest: computeManagedContractDigest(merged) };
}

afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
        rmSync(dir, { recursive: true, force: true });
    }
});

describe('managed ABI schema 4', () => {
    it('digest text matches the Rust canonical_digest_input byte-for-byte', () => {
        const expected = [
            'lane=jvm',
            'artifact=app.jar',
            'calling_convention=static-argv-launcher',
            'sum|two_sum|nyar/App|sum|(JJ)J|i64,i64|left,right|i64|nyar/invoke/sum',
        ].join('\n');
        const expectedDigest = createHash('sha256').update(expected).digest('hex');
        expect(computeManagedContractDigest(contract())).toBe(expectedDigest);
    });

    it('null launcher participates as the explicit sentinel, distinct from any name', () => {
        const withLauncher = computeManagedContractDigest(contract());
        const withoutLauncher = computeManagedContractDigest(contract({ entries: [entry({ launcher_class: null })] }));
        expect(withoutLauncher).not.toBe(withLauncher);
    });

    it('reads a sealed schema-4 contract with parameter names and null launcher', () => {
        const dir = writeSidecar(sealed({ entries: [entry({ launcher_class: null })] }));
        const parsed = readManagedAbiContract(dir, 'jvm', 'app.jar');
        expect(parsed.entries[0]?.parameter_names).toEqual(['left', 'right']);
        expect(parsed.entries[0]?.source_name).toBe('two_sum');
        expect(parsed.entries[0]?.launcher_class).toBeNull();
    });

    it('rejects legacy schema versions instead of reading them incompatibly', () => {
        for (const legacy of [1, 2, 3]) {
            const dir = writeSidecar({ ...sealed(), schema_version: legacy });
            expect(() => readManagedAbiContract(dir, 'jvm', 'app.jar')).toThrow(ManagedAbiError);
        }
    });

    it('rejects parameter names that are misaligned, blank, or duplicated', () => {
        const misaligned = writeSidecar(sealed({ entries: [entry({ parameter_names: ['left'] })] }));
        expect(() => readManagedAbiContract(misaligned, 'jvm', 'app.jar')).toThrow(/数量不一致/);
        const blank = writeSidecar(sealed({ entries: [entry({ parameter_names: ['left', ''] })] }));
        expect(() => readManagedAbiContract(blank, 'jvm', 'app.jar')).toThrow(/非空且唯一/);
        const duplicated = writeSidecar(sealed({ entries: [entry({ parameter_names: ['left', 'left'] })] }));
        expect(() => readManagedAbiContract(duplicated, 'jvm', 'app.jar')).toThrow(/非空且唯一/);
    });

    it('rejects a tampered contract whose digest no longer recomputes', () => {
        const sealedPayload = sealed();
        const tampered = { ...sealedPayload, entries: [{ ...entry(), parameter_names: ['right', 'left'] }] };
        const dir = writeSidecar(tampered);
        expect(() => readManagedAbiContract(dir, 'jvm', 'app.jar')).toThrow(/digest 不匹配/);
    });
});
