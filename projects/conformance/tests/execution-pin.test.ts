import { describe, expect, it } from 'vitest';

import {
    PIN_ARTIFACT_DIR,
    PIN_COMPILE_TARGET,
    PIN_LEGION_MJS,
    PIN_LEGION_WASM,
    PIN_NYAR_PATH,
    PIN_PHYSICAL_ENTRY,
    PIN_LOGICAL_ENTRY,
    encodeNodeExecutionPin,
    encodeNyarExecutionPin,
    readNyarExecutionPin,
    readNodeExecutionPin,
} from '../src/adapters/shared/execution-pin.ts';

/** 三态合同（[01 §4.12] 工具链身份门）：Absent 允许独立构建、Valid 执行已核验产物、Invalid 必须失败。 */
describe('execution pin 三态', () => {
    it('所有 pin 键都未出现时是 Absent，允许子进程独立构建', () => {
        const reading = readNodeExecutionPin({});
        expect(reading.state).toBe('absent');
    });

    it('字段完整且产物存在时是 Valid，携带已核验产物身份', () => {
        const reading = readNodeExecutionPin(
            encodeNodeExecutionPin({
                artifactDir: 'C:/tmp/out',
                legionMjs: __filename,
                legionWasm: __filename,
                physicalEntry: 'legion.mjs',
                compileTarget: 'wasm32-unknown-unknown-wasm',
            }),
        );
        expect(reading.state).toBe('valid');
        if (reading.state === 'valid') {
            expect(reading.pin.compileTarget).toBe('wasm32-unknown-unknown-wasm');
            expect(reading.pin.physicalEntry).toBe('legion.mjs');
        }
    });

    it('缺少 `compileTarget` 的 pin 是 Invalid，不与 Absent 合并', () => {
        const env = encodeNodeExecutionPin({
            artifactDir: 'C:/tmp/out',
            legionMjs: __filename,
            legionWasm: __filename,
            physicalEntry: 'legion.mjs',
            compileTarget: 'wasm32-unknown-unknown-wasm',
        });
        delete env[PIN_COMPILE_TARGET];
        const reading = readNodeExecutionPin(env);
        expect(reading.state).toBe('invalid');
        if (reading.state === 'invalid') {
            expect(reading.reason).toContain(PIN_COMPILE_TARGET);
        }
    });

    it('pin 指定产物消失是 Invalid，点名消失路径', () => {
        const reading = readNodeExecutionPin(
            encodeNodeExecutionPin({
                artifactDir: 'C:/tmp/out',
                legionMjs: 'C:/definitely/missing/legion.mjs',
                legionWasm: 'C:/definitely/missing/legion.wasm',
                physicalEntry: 'legion.mjs',
                compileTarget: 'wasm32-unknown-unknown-wasm',
            }),
        );
        expect(reading.state).toBe('invalid');
        if (reading.state === 'invalid') {
            expect(reading.reason).toContain('C:/definitely/missing/legion.mjs');
        }
    });

    it('空字符串字段按缺失处理，判 Invalid', () => {
        const reading = readNodeExecutionPin({
            [PIN_ARTIFACT_DIR]: 'C:/tmp/out',
            [PIN_LEGION_MJS]: '',
            [PIN_LEGION_WASM]: __filename,
            [PIN_PHYSICAL_ENTRY]: 'legion.mjs',
            [PIN_COMPILE_TARGET]: 'wasm32-unknown-unknown-wasm',
        });
        expect(reading.state).toBe('invalid');
        if (reading.state === 'invalid') {
            expect(reading.reason).toContain(PIN_LEGION_MJS);
        }
    });

    it('nyar lane 三态与 node lane 同构：Absent / Valid / Invalid', () => {
        expect(readNyarExecutionPin({}).state).toBe('absent');
        const valid = readNyarExecutionPin(
            encodeNyarExecutionPin({
                artifactDir: 'C:/tmp/out',
                nyarPath: __filename,
                physicalEntry: 'main.nyar',
                logicalEntry: 'solution.v',
                compileTarget: 'ovm-unknown-unknown-managed',
            }),
        );
        expect(valid.state).toBe('valid');
        const invalid = readNyarExecutionPin(
            encodeNyarExecutionPin({
                artifactDir: 'C:/tmp/out',
                nyarPath: 'C:/definitely/missing/main.nyar',
                physicalEntry: 'main.nyar',
                logicalEntry: 'solution.v',
                compileTarget: 'ovm-unknown-unknown-managed',
            }),
        );
        expect(invalid.state).toBe('invalid');
        if (invalid.state === 'invalid') {
            expect(invalid.reason).toContain('C:/definitely/missing/main.nyar');
        }
    });

    it('nyar lane 缺 `compileTarget` 判 Invalid，不与 Absent 合并', () => {
        const env = encodeNyarExecutionPin({
            artifactDir: 'C:/tmp/out',
            nyarPath: __filename,
            physicalEntry: 'main.nyar',
            logicalEntry: 'solution.v',
            compileTarget: 'ovm-unknown-unknown-managed',
        });
        delete env[PIN_COMPILE_TARGET];
        const reading = readNyarExecutionPin(env);
        expect(reading.state).toBe('invalid');
        if (reading.state === 'invalid') {
            expect(reading.reason).toContain(PIN_COMPILE_TARGET);
        }
    });

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
        const reading = readNodeExecutionPin();
        expect(reading.state).toBe('valid');
        if (reading.state === 'valid') {
            expect(reading.pin.artifactDir).toBe('C:/tmp/out');
            expect(reading.pin.physicalEntry).toBe('legion.mjs');
            expect(reading.pin.compileTarget).toBe('wasm32-unknown-unknown-wasm');
        }
        for (const [key, value] of previous) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    });

    it('nyar pin 的 `logicalEntry` 缺失同样判 Invalid', () => {
        const env = encodeNyarExecutionPin({
            artifactDir: 'C:/tmp/out',
            nyarPath: __filename,
            physicalEntry: 'main.nyar',
            logicalEntry: 'solution.v',
            compileTarget: 'ovm-unknown-unknown-managed',
        });
        delete env[PIN_LOGICAL_ENTRY];
        const reading = readNyarExecutionPin(env);
        expect(reading.state).toBe('invalid');
    });
});
