/**
 * 隔离判题链的 guest trap 门与相位标注（[01 §4.12] 验收观察门）。
 *
 * 预期 trap 只接受明确的 guest trap 类型与原因；glue/ABI/JS TypeError 等宿主侧
 * 异常不得判为通过。子进程回包必须携带真实观测阶段。
 */
import { describe, expect, it } from 'vitest';

import { assertValkyrieOutcome } from '../src/isolated/judge.ts';
import { executeRun } from '../src/isolated/child-loops.ts';
import { encodeValue } from '../src/isolated/protocol.ts';
import type { Candidate } from '../src/isolated/ts-entry.ts';

const CONTEXT = { problemId: 'panic-traps', args: {} };

describe('wasm lane 预期 trap 门', () => {
    it('明确 guest trap 且消息匹配 → 通过', () => {
        expect(() =>
            assertValkyrieOutcome(
                {
                    index: 0,
                    ok: false,
                    error: 'unwrap on `None` value',
                    phase: 'guest-invoke',
                    guestTrap: { kind: 'guest-raise', reason: 'unwrap on `None` value' },
                },
                'Error: unwrap on `None` value',
                null,
                'strict',
                CONTEXT,
            ),
        ).not.toThrow();
    });

    it('宿主侧异常即使消息恰好匹配也不判为通过', () => {
        expect(() =>
            assertValkyrieOutcome(
                { index: 0, ok: false, error: 'x is not a function', phase: 'guest-invoke' },
                'Error: x is not a function',
                null,
                'strict',
                CONTEXT,
            ),
        ).toThrow(/expected guest trap, got host anomaly phase=guest-invoke/);
    });

    it('guest trap 但消息不符 → 仍是断言失败', () => {
        expect(() =>
            assertValkyrieOutcome(
                { index: 0, ok: false, error: 'divide by zero', phase: 'guest-invoke', guestTrap: { kind: 'wasm-runtime-error', reason: 'divide by zero' } },
                'Error: overflow',
                null,
                'strict',
                CONTEXT,
            ),
        ).toThrow(/expected "Error: overflow"/);
    });
});

describe('子进程执行循环的相位标注', () => {
    const plan = { warmup: 0, iterations: 0, cases: [{ index: 0, args: encodeValue({ n: 1 }) as never }] };

    it('WebAssembly.RuntimeError → guest-trap 身份随包携带', async () => {
        const candidate: Candidate = () => {
            throw new WebAssembly.RuntimeError('unreachable');
        };
        const outcome = await executeRun(candidate, plan);
        const result = outcome.results[0]!;
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.phase).toBe('guest-invoke');
            expect(result.guestTrap).toEqual({ kind: 'wasm-runtime-error', reason: 'unreachable' });
        }
    });

    it('glue demarshal 异常归 demarshal-normalize 阶段且无 guest trap', async () => {
        const candidate: Candidate = () => {
            throw new Error('[wasm-js-glue]/ret: Cannot demarshal I64 from 3: expected a BigInt');
        };
        const outcome = await executeRun(candidate, plan);
        const result = outcome.results[0]!;
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.phase).toBe('demarshal-normalize');
            expect(result.guestTrap).toBeUndefined();
        }
    });

    it('普通 JS TypeError 记宿主异常，不伪造 guest trap', async () => {
        const candidate: Candidate = () => {
            throw new TypeError('host glue broken');
        };
        const outcome = await executeRun(candidate, plan);
        const result = outcome.results[0]!;
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.phase).toBe('guest-invoke');
            expect(result.guestTrap).toBeUndefined();
        }
    });
});
