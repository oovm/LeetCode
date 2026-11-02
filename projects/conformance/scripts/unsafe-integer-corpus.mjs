#!/usr/bin/env node
/**
 * 不安全整数语料的扫描与转换工具（文本级，不经 `JSON.parse`，不丢精度）。
 *
 * 背景：`metadata.json` 里超过 `Number.MAX_SAFE_INTEGER` 的整数/浮点字面量，
 * 经 `JSON.parse` 变成 double 后低位丢失，四 lane 与参考端拿到的是被截断的值。
 * 约定（生成器合同）：凡越过安全整数的数值字面量，一律写成**十进制字符串**，
 * 保留原始十进制文本，不做 double 往返。
 *
 * 子命令：
 *   scan     扫描全部 `projects/problems/<slug>/metadata.json`，分类统计并按需落盘报告。
 *            `--assert` 时若仍存在**裸数字**形态的超安全整数字面量则以退出码 1 失败（CI 级检查）。
 *   convert  把裸数字形态的超安全整数字面量就地改写为十进制字符串（保留原文），
 *            已是字符串的不动；输出逐文件与合计的「转换前后」统计。
 *
 * 分类：
 *   safe            安全整数（|v| ≤ 2^53），不动。
 *   fits_i64        超安全整数但在 i64 内 → 可转字符串（合法 i64 输入）。
 *   fits_u64        超 i64 但在 u64 内 → 可转字符串（需 u64 通道）。
 *   beyond_u64      超 u64 → 生成器 bug，转字符串仅保留原文，消费端按范围结构化报错。
 *   float_literal   浮点字面量（含 `.`/`e`）→ 转字符串仅保留原文，非 i64 输入。
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// 脚本位于 `projects/conformance/scripts/`，仓根向上三级；不依赖进程 cwd。
const LEETCODE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const PROBLEMS_DIR = join(LEETCODE_ROOT, 'projects', 'problems');
const REPORT_PATH = join(LEETCODE_ROOT, 'projects', 'conformance', 'reports', 'unsafe-integer-corpus.json');

const MAX_SAFE = 9007199254740991n;
const I64_MIN = -(1n << 63n);
const I64_MAX = (1n << 63n) - 1n;
const U64_MAX = (1n << 64n) - 1n;

/** 逐字符扫描 JSON 文本，抽取字符串之外的全部数值字面量。 */
export function scanJsonNumbers(text) {
    const results = [];
    let i = 0;
    const n = text.length;
    while (i < n) {
        const c = text[i];
        if (c === '"') {
            i++;
            while (i < n && text[i] !== '"') {
                if (text[i] === '\\') i++;
                i++;
            }
            i++;
            continue;
        }
        if (c === '-' || (c >= '0' && c <= '9')) {
            const start = i;
            if (text[i] === '-') i++;
            let hasDigits = false;
            while (i < n && text[i] >= '0' && text[i] <= '9') { i++; hasDigits = true; }
            if (!hasDigits) { continue; }
            let isFloat = false;
            if (i < n && text[i] === '.') {
                isFloat = true;
                i++;
                while (i < n && text[i] >= '0' && text[i] <= '9') i++;
            }
            if (i < n && (text[i] === 'e' || text[i] === 'E')) {
                isFloat = true;
                i++;
                if (i < n && (text[i] === '+' || text[i] === '-')) i++;
                while (i < n && text[i] >= '0' && text[i] <= '9') i++;
            }
            results.push({ start, end: i, literal: text.slice(start, i), isFloat });
            continue;
        }
        i++;
    }
    return results;
}

/** 分类单个字面量。 */
export function classifyNumber(literal, isFloat) {
    if (isFloat) {
        // 浮点字面量：只有绝对值越过安全整数才判为缺陷（精度已损）；
        // 小的合法 f64（如 0.5、62.5、3.14）不在本工具口径内。
        const magnitude = Math.abs(Number(literal));
        if (!Number.isFinite(magnitude) || magnitude > Number(MAX_SAFE)) {
            return 'float_literal';
        }
        return 'safe';
    }
    let v;
    try {
        v = BigInt(literal);
    } catch {
        return 'float_literal';
    }
    if (v >= -MAX_SAFE && v <= MAX_SAFE) return 'safe';
    if (v >= I64_MIN && v <= I64_MAX) return 'fits_i64';
    if (v >= 0n && v <= U64_MAX) return 'fits_u64';
    return 'beyond_u64';
}

// codemod 只转换纯整数字面量（fits_i64/fits_u64/beyond_u64）为字符串；
// 浮点字面量（float_literal）是生成器 bug（非整数或超范围），留在回填清单，
// 不在此转换——避免把 TS/Python 的合法浮点参数字符串化。
const CONVERTIBLE = new Set(['fits_i64', 'fits_u64', 'beyond_u64']);
// 断言口径：不得存在裸数字形态的超安全整数（fits_i64/fits_u64/beyond_u64），
// 也不得存在超安全整数的浮点字面量（float_literal，精度已损）——真浮点题除外。
const ASSERT_BARE = new Set(['fits_i64', 'fits_u64', 'beyond_u64']);
// 真浮点题豁免清单：题意本身要求 f64 语义（`x^n` 等），超安全整数的浮点期望合法。
// 只有这类题允许保留 float_literal；整数题与字符串题的浮点一律回填。
const FLOAT_SEMANTIC_SLUGS = new Set(['powx-n']);

function listMetadataFiles() {
    return readdirSync(PROBLEMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.'))
        .map((entry) => ({ slug: entry.name, path: join(PROBLEMS_DIR, entry.name, 'metadata.json') }))
        .filter((entry) => existsSync(entry.path));
}

function analyzeFile(path) {
    const text = readFileSync(path, 'utf8');
    return scanJsonNumbers(text).map((token) => ({ ...token, kind: classifyNumber(token.literal, token.isFloat) }));
}

function scan() {
    const files = listMetadataFiles();
    const bySlug = [];
    const totals = { fits_i64: 0, fits_u64: 0, beyond_u64: 0, float_literal: 0 };
    let unsafe = 0;
    let bareInteger = 0;
    let floatLiteralAssert = 0;
    for (const { slug, path } of files) {
        const hits = analyzeFile(path).filter((token) => token.kind !== 'safe');
        if (hits.length === 0) continue;
        const counts = {};
        for (const hit of hits) {
            counts[hit.kind] = (counts[hit.kind] ?? 0) + 1;
            totals[hit.kind] += 1;
            if (ASSERT_BARE.has(hit.kind)) bareInteger += 1;
            if (hit.kind === 'float_literal' && !FLOAT_SEMANTIC_SLUGS.has(slug)) floatLiteralAssert += 1;
        }
        unsafe += hits.length;
        bySlug.push({ slug, occurrences: hits.length, counts });
    }
    bySlug.sort((a, b) => b.occurrences - a.occurrences);
    return { scannedFiles: files.length, totalOccurrences: unsafe, bareIntegerOccurrences: bareInteger, floatLiteralAssertOccurrences: floatLiteralAssert, reasonTotals: totals, slugs: bySlug };
}

function convert() {
    const files = listMetadataFiles();
    let filesChanged = 0;
    let literalsConverted = 0;
    const perFile = [];
    for (const { slug, path } of files) {
        const text = readFileSync(path, 'utf8');
        const tokens = analyzeFile(path).filter((token) => CONVERTIBLE.has(token.kind));
        if (tokens.length === 0) continue;
        // 从后往前替换，避免位移
        let out = text;
        for (const token of tokens.sort((a, b) => b.start - a.start)) {
            out = out.slice(0, token.start) + `"${token.literal}"` + out.slice(token.end);
        }
        writeFileSync(path, out, 'utf8');
        filesChanged += 1;
        literalsConverted += tokens.length;
        perFile.push({ slug, converted: tokens.length });
    }
    return { filesChanged, literalsConverted, perFile };
}

const isDirectRun = (() => {
    const entry = process.argv[1];
    if (!entry) return false;
    try {
        return fileURLToPath(import.meta.url) === resolve(entry);
    } catch {
        return false;
    }
})();

if (isDirectRun) {
    const mode = process.argv[2] ?? 'scan';
    const assertMode = process.argv.includes('--assert');
    const writeReport = process.argv.includes('--report');

    if (mode === 'scan') {
        const result = scan();
        console.log(`扫描 ${result.scannedFiles} 份 metadata.json，命中超安全整数字面量 ${result.totalOccurrences} 处`);
        console.log(`  fits_i64=${result.reasonTotals.fits_i64} fits_u64=${result.reasonTotals.fits_u64} beyond_u64=${result.reasonTotals.beyond_u64} float_literal=${result.reasonTotals.float_literal}`);
        console.log(`  受影响 slug：${result.slugs.length} 个；其中裸整数 ${result.bareIntegerOccurrences} 处、浮点字面量（断言口径，豁免 ${FLOAT_SEMANTIC_SLUGS.size} 个真浮点题）${result.floatLiteralAssertOccurrences} 处`);
        if (writeReport) {
            mkdirSync(join(REPORT_PATH, '..'), { recursive: true });
            writeFileSync(
                REPORT_PATH,
                JSON.stringify(
                    {
                        generatedAt: new Date().toISOString().slice(0, 10),
                        method: '文本级扫描 projects/problems/*/metadata.json 中越过 JSON 安全整数的数值字面量（不经 JSON.parse，字符串之外）',
                        floatSemanticSlugs: [...FLOAT_SEMANTIC_SLUGS],
                        scannedFiles: result.scannedFiles,
                        totalOccurrences: result.totalOccurrences,
                        bareIntegerOccurrences: result.bareIntegerOccurrences,
                        floatLiteralAssertOccurrences: result.floatLiteralAssertOccurrences,
                        reasonTotals: result.reasonTotals,
                        affectedSlugs: result.slugs.length,
                        slugs: result.slugs,
                    },
                    null,
                    2,
                ) + '\n',
                'utf8',
            );
            console.log(`  报告已写入 ${REPORT_PATH}`);
        }
        if (assertMode) {
            if (result.bareIntegerOccurrences > 0) {
                console.error(`断言失败：仍存在 ${result.bareIntegerOccurrences} 处裸数字形态的超安全整数（fits_i64/fits_u64/beyond_u64），须先转换为十进制字符串。`);
                process.exit(1);
            }
            if (result.floatLiteralAssertOccurrences > 0) {
                console.error(`断言失败：仍存在 ${result.floatLiteralAssertOccurrences} 处超安全整数的浮点字面量（float_literal，精度已损），须按参考算法回填为精确值。`);
                process.exit(1);
            }
            console.log('断言通过：不存在裸数字形态的超安全整数，也不存在待回填的浮点字面量（真浮点题豁免）。');
        }
    } else if (mode === 'convert') {
        const result = convert();
        console.log(`转换 ${result.filesChanged} 份文件，共 ${result.literalsConverted} 处裸数字 → 十进制字符串`);
        for (const entry of result.perFile) {
            console.log(`  ${entry.slug}: ${entry.converted}`);
        }
    } else {
        console.error('usage: unsafe-integer-corpus.mjs <scan|convert> [--assert] [--report]');
        process.exit(2);
    }
}
