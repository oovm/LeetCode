/**
 * `json_to_cases_ts.mjs` 转换器的保真测试。
 *
 * 核心断言：转换报告里每个转换点的「原文数字串」与「bigint 十进制串」逐字相等；
 * `--check` 重生成与已提交产物逐字节一致（幂等）；生成的用例模块可真实 import 且承载 bigint。
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { CONFORMANCE_ROOT } from '../src/domain/paths.ts';
import { partitionCases, validateCasesModule } from '../src/isolated/cases.ts';

const CONVERTER = join(CONFORMANCE_ROOT, 'scripts', 'json_to_cases_ts.mjs');
const FIXTURE = join(CONFORMANCE_ROOT, 'tests', 'fixtures', 'isolated', 'convert-sample');
const MODULE_SPECIFIER = '../../../../src/isolated/cases.ts';

type ConversionEntry = { original: string; bigintText: string };

function runConverter(extraArgs: string[]): string {
    return execFileSync(process.execPath, [CONVERTER, FIXTURE, '--cases-module', MODULE_SPECIFIER, ...extraArgs], {
        cwd: CONFORMANCE_ROOT,
        encoding: 'utf8',
    });
}

describe('json_to_cases_ts 转换保真', () => {
    it('每个转换点原文数字串与 bigint 十进制串逐字相等', () => {
        const dir = mkdtempSync(join(tmpdir(), 'cases-report-'));
        try {
            const reportPath = join(dir, 'report.json');
            runConverter(['--check', '--report', reportPath]);
            const report = JSON.parse(readFileSync(reportPath, 'utf8')) as {
                conversions: ConversionEntry[];
                defectRecovered: number;
                defectKept: number;
            };
            expect(report.conversions.length).toBeGreaterThan(0);
            for (const entry of report.conversions) {
                const digits = entry.original.startsWith('"') ? JSON.parse(entry.original) : entry.original;
                // 保真证明：原文逐字数字串 == bigint 十进制串（不经 double 往返）。
                expect(BigInt(digits).toString()).toBe(entry.bigintText);
                expect(digits).toBe(entry.bigintText);
            }
            expect(report.defectRecovered).toBe(1);
            expect(report.defectKept).toBe(1);
        } finally {
            rmSync(dir, { recursive: true, force: true });
        }
    });

    it('--check 幂等：重生成与已提交产物逐字节一致', () => {
        const out = runConverter(['--check']);
        expect(out).toContain('"check":"identical"');
    });

    it('生成的用例模块可 import：bigint 承载、缺陷标注保留、可执行分组正确', async () => {
        const mod = (await import('./fixtures/isolated/convert-sample/convert-sample.cases.ts')) as { cases: unknown };
        const validation = validateCasesModule(mod.cases, 'convert-sample.cases.ts');
        if (!validation.ok) {
            throw new Error(validation.message);
        }
        const { executable, defect } = partitionCases(validation.cases);
        expect(executable.length).toBe(5);
        expect(defect.length).toBe(1);
        expect(defect[0]!.corpusDefect?.kind).toBe('float_literal');

        const second = executable[1]!;
        expect(second.args.n).toBe(123456789012345678901234567890n);
        expect(second.expected).toBe(123456789012345678901234567891n);
        const third = executable[2]!;
        expect(third.args.n).toBe(340282366920938463463374607431768211455n);
        // 字符串型键不误转：64 位二进制串原样保留。
        const fourth = executable[3]!;
        expect(typeof fourth.args.s).toBe('string');
        // 可恢复的 corpusDefect 条目已恢复为可执行用例并移除标注。
        const recovered = executable[4]!;
        expect(recovered.corpusDefect).toBeUndefined();
        expect(recovered.args.n).toBe(18446744073709551615n);
    });
});
