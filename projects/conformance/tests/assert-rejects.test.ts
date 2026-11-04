import { describe, expect, it } from 'vitest';
import { assertRejectsTestCase } from '../src/domain/assert.ts';

describe('assertRejectsTestCase', () => {
    it('fails when the async call resolves instead of throwing', async () => {
        await expect(
            assertRejectsTestCase(3, 'Error: list index out of range', async () => 42),
        ).rejects.toThrow('tests[3]: expected "Error: list index out of range", no exception raised');
    });

    it('passes when the async call rejects with the expected message', async () => {
        await expect(
            assertRejectsTestCase(4, 'Error: boom', async () => {
                throw new Error('boom');
            }),
        ).resolves.toBeUndefined();
    });

    it('fails when the async call rejects with a different message', async () => {
        await expect(
            assertRejectsTestCase(5, 'Error: boom', async () => {
                throw new Error('other');
            }),
        ).rejects.toThrow('tests[5]: expected "Error: boom", got "Error: other"');
    });
});
