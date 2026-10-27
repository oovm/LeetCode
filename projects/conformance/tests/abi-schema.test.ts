import { describe, expect, it } from 'vitest';

import {
    type AbiGlueEntry,
    type AbiNamedAggregateType,
    AbiSchemaError,
    findGlueEntry,
    type LibraryInvokeSchema,
    marshalArgsBySchema,
    parseLibraryInvokeSchema,
    unmarshalReturnBySchema,
    type WasmAbiType,
} from '../src/adapters/valkyrie-node/abi.ts';

/** nyar-vm.rs emitter 的权威 `nyar.library_invoke` 形状。 */
function rawSchema(): Record<string, unknown> {
    return {
        version: 0,
        exports: {
            twoSum: {
                params: [
                    {
                        index: 0,
                        name: 'nums',
                        type: {
                            kind: 'NamedAggregate',
                            name: 'ArrayList',
                            module_path: 'std::collections',
                            generic_args: [{ kind: 'I64' }],
                        },
                        carrier: 'handle',
                    },
                    {
                        index: 1,
                        name: 'target',
                        type: { kind: 'I64' },
                        carrier: 'i64',
                    },
                ],
                returns: {
                    kind: 'NamedAggregate',
                    name: 'ArrayList',
                    module_path: 'std::collections',
                    generic_args: [{ kind: 'I64' }],
                },
            },
        },
        glue_entries: [
            {
                kind: 'NamedAggregate',
                name: 'ArrayList',
                module_path: 'std::collections',
                generic_args: [{ kind: 'I64' }],
                operations: [
                    {
                        operation: 'construct',
                        export_name: '$seq_i64_new',
                        param_carriers: ['i32'],
                        return_carrier: 'i32',
                        export_source: 'declared',
                    },
                    {
                        operation: 'push',
                        export_name: '$seq_i64_push',
                        param_carriers: ['i32', 'i64'],
                        return_carrier: 'void',
                    },
                    {
                        operation: 'length',
                        export_name: '$seq_i64_len',
                        param_carriers: ['i32'],
                        return_carrier: 'i32',
                    },
                    {
                        operation: 'at',
                        export_name: '$seq_i64_at',
                        param_carriers: ['i32', 'i32'],
                        return_carrier: 'i64',
                    },
                ],
            },
        ],
        abi_digest: 'sha256-deadbeef',
    };
}

function parse(raw: Record<string, unknown>): LibraryInvokeSchema {
    return parseLibraryInvokeSchema(JSON.stringify(raw));
}

type RawExport = { params: unknown[]; returns: unknown };

function twoSumExport(raw: Record<string, unknown>): RawExport {
    return (raw.exports as Record<string, RawExport>).twoSum!;
}

function expectAbiError(run: () => unknown, code: string): void {
    try {
        run();
    } catch (err) {
        expect(err).toBeInstanceOf(AbiSchemaError);
        expect((err as AbiSchemaError).code).toBe(code);
        return;
    }
    throw new Error('expected AbiSchemaError, but no error was thrown');
}

function namedAggregate(type: WasmAbiType): AbiNamedAggregateType {
    if (type.kind !== 'NamedAggregate') throw new Error(`expected NamedAggregate, got ${type.kind}`);
    return type;
}

describe('nyar.library_invoke schema parsing', () => {
    it('parses the authoritative {version, exports, glue_entries, abi_digest} format', () => {
        const schema = parse(rawSchema());
        expect(schema.version).toBe(0);
        expect(schema.abi_digest).toBe('sha256-deadbeef');
        expect(Object.keys(schema.exports)).toEqual(['twoSum']);
        expect(schema.exports.twoSum?.params.map((param) => param.name)).toEqual(['nums', 'target']);
        expect(schema.exports.twoSum?.params.map((param) => param.type.kind)).toEqual(['NamedAggregate', 'I64']);
        expect(schema.exports.twoSum?.params.map((param) => param.carrier)).toEqual(['handle', 'i64']);
        expect(schema.glue_entries).toHaveLength(1);
        expect(schema.glue_entries[0]?.operations.map((operation) => operation.operation)).toEqual(['construct', 'push', 'length', 'at']);
    });

    it('parses nested NamedAggregate generic args', () => {
        const raw = rawSchema();
        (raw.exports as Record<string, { returns: unknown }>).twoSum!.returns = {
            kind: 'NamedAggregate',
            name: 'ArrayList',
            module_path: 'std::collections',
            generic_args: [
                {
                    kind: 'NamedAggregate',
                    name: 'ArrayList',
                    module_path: 'std::collections',
                    generic_args: [{ kind: 'I64' }],
                },
            ],
        };
        const returns = parse(raw).exports.twoSum!.returns;
        const outer = namedAggregate(returns);
        expect(outer.generic_args).toHaveLength(1);
        const inner = namedAggregate(outer.generic_args[0]!);
        expect(inner.name).toBe('ArrayList');
        expect(inner.module_path).toBe('std::collections');
        expect(inner.generic_args).toEqual([{ kind: 'I64' }]);
    });

    it('rejects a missing or empty abi_digest', () => {
        const missing = rawSchema();
        delete missing.abi_digest;
        expectAbiError(() => parse(missing), 'missing_abi_digest');

        const empty = rawSchema();
        empty.abi_digest = '   ';
        expectAbiError(() => parse(empty), 'missing_abi_digest');
    });

    it('rejects an unsupported version', () => {
        const raw = rawSchema();
        raw.version = 1;
        expectAbiError(() => parse(raw), 'unsupported_version');
    });

    it('rejects unknown WasmAbiType kinds', () => {
        const raw = rawSchema();
        (raw.exports as Record<string, { returns: unknown }>).twoSum!.returns = { kind: 'Widget' };
        expectAbiError(() => parse(raw), 'unknown_kind');
    });
});

describe('parameter identity validation', () => {
    it('accepts out-of-order params and normalizes them by index', () => {
        const raw = rawSchema();
        twoSumExport(raw).params.reverse();
        const schema = parse(raw);
        expect(schema.exports.twoSum?.params.map((param) => param.index)).toEqual([0, 1]);
        expect(schema.exports.twoSum?.params.map((param) => param.name)).toEqual(['nums', 'target']);
    });

    it('rejects a params entry without an index', () => {
        const raw = rawSchema();
        twoSumExport(raw).params = [{ kind: 'I64' }, { kind: 'I64' }];
        expectAbiError(() => parse(raw), 'invalid_param_index');
    });

    it('rejects duplicate parameter names', () => {
        const raw = rawSchema();
        const params = twoSumExport(raw).params as Array<Record<string, unknown>>;
        params[1]!.name = 'nums';
        expectAbiError(() => parse(raw), 'duplicate_param_identity');
    });

    it('rejects duplicate parameter indices', () => {
        const raw = rawSchema();
        const params = twoSumExport(raw).params as Array<Record<string, unknown>>;
        params[1]!.index = 0;
        expectAbiError(() => parse(raw), 'invalid_param_index');
    });

    it('rejects non-contiguous parameter indices', () => {
        const raw = rawSchema();
        const params = twoSumExport(raw).params as Array<Record<string, unknown>>;
        params[1]!.index = 2;
        expectAbiError(() => parse(raw), 'invalid_param_index');
    });

    it('rejects a non-integer or negative parameter index', () => {
        const negative = rawSchema();
        (twoSumExport(negative).params as Array<Record<string, unknown>>)[1]!.index = -1;
        expectAbiError(() => parse(negative), 'invalid_param_index');

        const fractional = rawSchema();
        (twoSumExport(fractional).params as Array<Record<string, unknown>>)[1]!.index = 1.5;
        expectAbiError(() => parse(fractional), 'invalid_param_index');
    });

    it('rejects a missing carrier', () => {
        const raw = rawSchema();
        const params = twoSumExport(raw).params as Array<Record<string, unknown>>;
        delete params[1]!.carrier;
        expectAbiError(() => parse(raw), 'invalid_carrier');
    });
});

describe('glue registry lookup', () => {
    const schema = parse(rawSchema());

    it('matches module_path + name + generic_args', () => {
        const entry = findGlueEntry(schema, namedAggregate(schema.exports.twoSum!.returns));
        expect(entry.name).toBe('ArrayList');
        expect(entry.module_path).toBe('std::collections');
    });

    it('does not match by simple name when module_path differs', () => {
        expectAbiError(
            () =>
                findGlueEntry(schema, {
                    name: 'ArrayList',
                    module_path: 'std::other',
                    generic_args: [{ kind: 'I64' }],
                }),
            'glue_entry_not_found',
        );
    });

    it('does not match when generic_args differ', () => {
        expectAbiError(
            () =>
                findGlueEntry(schema, {
                    name: 'ArrayList',
                    module_path: 'std::collections',
                    generic_args: [{ kind: 'I32' }],
                }),
            'glue_entry_not_found',
        );
    });
});

describe('schema-driven marshal/unmarshal', () => {
    const schema = parse(rawSchema());

    it('constructs aggregates with capacity/length, not element values', () => {
        const calls: Array<{ name: string; args: unknown[] }> = [];
        const invokeExport = (name: string, ...args: unknown[]): unknown => {
            calls.push({ name, args });
            return name.endsWith('_new') ? 100 : undefined;
        };

        const marshaled = marshalArgsBySchema(schema, schema.exports.twoSum!, { nums: [3, 4], target: 6 }, invokeExport);

        expect(marshaled).toEqual([100, 6n]);
        expect(calls).toEqual([
            { name: '$seq_i64_new', args: [2] },
            { name: '$seq_i64_push', args: [100, 3n] },
            { name: '$seq_i64_push', args: [100, 4n] },
        ]);
        // construct 的第一个参数是数组长度，不是第一个元素值。
        expect(calls[0]?.args[0]).toBe(2);
    });

    it('ignores metadata key order and takes values by parameter name', () => {
        const calls: Array<{ name: string; args: unknown[] }> = [];
        const invokeExport = (name: string, ...args: unknown[]): unknown => {
            calls.push({ name, args });
            return name.endsWith('_new') ? 100 : undefined;
        };

        const marshaled = marshalArgsBySchema(schema, schema.exports.twoSum!, { target: 6, nums: [3, 4] }, invokeExport);

        expect(marshaled).toEqual([100, 6n]);
        expect(calls.map((call) => call.args)).toEqual([[2], [100, 3n], [100, 4n]]);
    });

    it('rejects a missing argument', () => {
        const invokeExport = (): unknown => undefined;
        expectAbiError(
            () => marshalArgsBySchema(schema, schema.exports.twoSum!, { nums: [3, 4] }, invokeExport),
            'missing_argument',
        );
    });

    it('rejects an argument the schema does not declare', () => {
        const invokeExport = (): unknown => undefined;
        expectAbiError(
            () => marshalArgsBySchema(schema, schema.exports.twoSum!, { nums: [3, 4], target: 6, extra: 1 }, invokeExport),
            'unknown_argument',
        );
    });

    it('reads aggregates back through length/at', () => {
        const calls: Array<{ name: string; args: unknown[] }> = [];
        const invokeExport = (name: string, ...args: unknown[]): unknown => {
            calls.push({ name, args });
            if (name === '$seq_i64_len') return 2;
            if (name === '$seq_i64_at') return args[1] === 1 ? 3n : 4n;
            throw new Error(`unexpected export ${name}`);
        };

        const value = unmarshalReturnBySchema(schema, schema.exports.twoSum!, 100, invokeExport);
        expect(value).toEqual([3, 4]);
        expect(calls.map((call) => call.args)).toEqual([[100], [100, 1], [100, 2]]);
    });

    it('rejects aggregate params without a glue entry', () => {
        const invokeExport = (): unknown => undefined;
        const schemaWithoutGlue: LibraryInvokeSchema = { ...schema, glue_entries: [] as AbiGlueEntry[] };
        expectAbiError(
            () => marshalArgsBySchema(schemaWithoutGlue, schema.exports.twoSum!, { nums: [3, 4], target: 6 }, invokeExport),
            'glue_entry_not_found',
        );
    });
});
