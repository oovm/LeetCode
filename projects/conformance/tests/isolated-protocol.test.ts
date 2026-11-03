import { describe, expect, it } from 'vitest';

import {
    createLineAssembler,
    decodeLine,
    decodeValue,
    encodeLine,
    encodeValue,
    ProtocolDecodeError,
    UnsafeNumberError,
} from '../src/isolated/protocol.ts';

describe('isolated protocol tagged codec', () => {
    it('bigint 经 tagged 结构往返保真（含嵌套数组/对象）', () => {
        const value = {
            small: 42,
            big: 123456789012345678901234567890n,
            nested: [1n, { deep: -9223372036854775808n }, 'text'],
            flag: true,
            nothing: null,
        };
        const round = decodeValue(encodeValue(value));
        expect(round).toEqual(value);
        // 编码结果必须能被 JSON.stringify 直接承载（协议底线）。
        expect(() => JSON.stringify(encodeValue(value))).not.toThrow();
    });

    it('undefined 经 tag 保留数组洞位', () => {
        const value = [undefined, 1];
        const round = decodeValue(encodeValue(value)) as unknown[];
        expect(round.length).toBe(2);
        expect(round[0]).toBeUndefined();
        expect(round[1]).toBe(1);
    });

    it('普通浮点原样通过（与 JSON 语料同语义）', () => {
        expect(decodeValue(encodeValue(0.5))).toBe(0.5);
        expect(decodeValue(encodeValue(-3.14))).toBe(-3.14);
    });

    it('越过安全整数的 number 被拒绝（UnsafeNumberError），不静默降级', () => {
        expect(() => encodeValue(9223372036854775808)).toThrow(UnsafeNumberError);
        expect(() => encodeValue({ n: 9007199254740993 })).toThrow(UnsafeNumberError);
    });

    it('NaN 与 Infinity 被拒绝', () => {
        expect(() => encodeValue(Number.NaN)).toThrow(UnsafeNumberError);
        expect(() => encodeValue(Number.POSITIVE_INFINITY)).toThrow(UnsafeNumberError);
    });

    it('非法 tag 结构在解码侧结构化报错', () => {
        expect(() => decodeValue({ $bigint: '12x34' } as never)).toThrow(ProtocolDecodeError);
        expect(() => decodeValue({ $unknown: 1 } as never)).toThrow(ProtocolDecodeError);
    });
});

describe('isolated protocol NDJSON framing', () => {
    it('消息编码为一行 JSON', () => {
        const line = encodeLine({ type: 'bye' });
        expect(line.endsWith('\n')).toBe(true);
        expect(decodeLine(line)).toEqual({ type: 'bye' });
    });

    it('粘包/半包按行重组（含 CRLF 与空行）', () => {
        const lines: string[] = [];
        const feed = createLineAssembler((line) => lines.push(line));
        feed('{"type":"bye"}\r\n{"type":"ready"');
        feed('}\r\n\n{"type":"x"}\n');
        expect(lines).toEqual(['{"type":"bye"}', '{"type":"ready"}', '{"type":"x"}']);
    });

    it('坏行与非消息对象结构化报错', () => {
        expect(() => decodeLine('not json')).toThrow(ProtocolDecodeError);
        expect(() => decodeLine('{"noType":1}')).toThrow(ProtocolDecodeError);
    });
});
