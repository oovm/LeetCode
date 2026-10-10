import { describe, expect, it } from 'vitest';

import {
    PIN_ARTIFACT_DIR,
    PIN_LEGION_MJS,
    PIN_LEGION_WASM,
    PIN_PHYSICAL_ENTRY,
    encodeNodeExecutionPin,
    readNodeExecutionPinFromEnv,
} from '../src/adapters/shared/execution-pin.ts';

describe('execution pin env', () => {
    it('round-trips node pin through process env', () => {
        const previous = {
            artifactDir: process.env[PIN_ARTIFACT_DIR],
            legionMjs: process.env[PIN_LEGION_MJS],
            legionWasm: process.env[PIN_LEGION_WASM],
            physicalEntry: process.env[PIN_PHYSICAL_ENTRY],
        };
        Object.assign(process.env, encodeNodeExecutionPin({
            artifactDir: 'C:/tmp/out',
            legionMjs: __filename,
            legionWasm: __filename,
            physicalEntry: 'legion.mjs',
        }));
        const pin = readNodeExecutionPinFromEnv();
        expect(pin?.artifactDir).toBe('C:/tmp/out');
        expect(pin?.physicalEntry).toBe('legion.mjs');
        for (const [key, value] of Object.entries(previous)) {
            const envKey = {
                artifactDir: PIN_ARTIFACT_DIR,
                legionMjs: PIN_LEGION_MJS,
                legionWasm: PIN_LEGION_WASM,
                physicalEntry: PIN_PHYSICAL_ENTRY,
            }[key as keyof typeof previous];
            if (value === undefined) {
                delete process.env[envKey];
            } else {
                process.env[envKey] = value;
            }
        }
    });
});
