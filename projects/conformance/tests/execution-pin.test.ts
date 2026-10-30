import { describe, expect, it } from 'vitest';

import {
    PIN_ARTIFACT_DIR,
    PIN_COMPILE_TARGET,
    PIN_LEGION_MJS,
    PIN_LEGION_WASM,
    PIN_PHYSICAL_ENTRY,
    encodeNodeExecutionPin,
    readNodeExecutionPinFromEnv,
} from '../src/adapters/shared/execution-pin.ts';

describe('execution pin env', () => {
    it('round-trips node pin through process env', () => {
        const envKeys = [PIN_ARTIFACT_DIR, PIN_LEGION_MJS, PIN_LEGION_WASM, PIN_PHYSICAL_ENTRY, PIN_COMPILE_TARGET] as const;
        const previous = envKeys.map((key) => [key, process.env[key]] as const);
        Object.assign(process.env, encodeNodeExecutionPin({
            artifactDir: 'C:/tmp/out',
            legionMjs: __filename,
            legionWasm: __filename,
            physicalEntry: 'legion.mjs',
            compileTarget: 'wasm32-unknown-unknown-wasm',
        }));
        const pin = readNodeExecutionPinFromEnv();
        expect(pin?.artifactDir).toBe('C:/tmp/out');
        expect(pin?.physicalEntry).toBe('legion.mjs');
        expect(pin?.compileTarget).toBe('wasm32-unknown-unknown-wasm');
        for (const [key, value] of previous) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    });

    it('缺少 compileTarget 的 pin 视为不完整，由子进程重建计划', () => {
        const previous = {
            artifactDir: process.env[PIN_ARTIFACT_DIR],
            legionMjs: process.env[PIN_LEGION_MJS],
            legionWasm: process.env[PIN_LEGION_WASM],
            physicalEntry: process.env[PIN_PHYSICAL_ENTRY],
            compileTarget: process.env[PIN_COMPILE_TARGET],
        };
        process.env[PIN_ARTIFACT_DIR] = 'C:/tmp/out';
        process.env[PIN_LEGION_MJS] = __filename;
        process.env[PIN_LEGION_WASM] = __filename;
        process.env[PIN_PHYSICAL_ENTRY] = 'legion.mjs';
        delete process.env[PIN_COMPILE_TARGET];
        expect(readNodeExecutionPinFromEnv()).toBeNull();
        for (const [key, value] of Object.entries(previous)) {
            const envKey = {
                artifactDir: PIN_ARTIFACT_DIR,
                legionMjs: PIN_LEGION_MJS,
                legionWasm: PIN_LEGION_WASM,
                physicalEntry: PIN_PHYSICAL_ENTRY,
                compileTarget: PIN_COMPILE_TARGET,
            }[key as keyof typeof previous];
            if (value === undefined) {
                delete process.env[envKey];
            } else {
                process.env[envKey] = value;
            }
        }
    });
});
