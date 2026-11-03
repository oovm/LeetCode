#!/usr/bin/env node
/**
 * `metadata.json` → `<slug>.cases.ts` 逐字转换器。
 *
 * 保真合同：
 * - 不依赖 `JSON.parse` 承载数值——所有数值字面量从原文逐字扫描（tokenizer 跳过字符串内部），
 *   整数越 `Number.MAX_SAFE_INTEGER` 一律改写为 `bigint` 字面量（`<十进制原文>n`）。
 * - 字符串形态的十进制整数（旧生成器约定）在「整数型键」下同样逐字还原为 `bigint` 字面量；
 *   仅当 `BigInt(文本).toString()` 与原文逐字相等才转换，否则原样保留字符串。
 * - 每个转换点都进 `conversions` 报告（原文 vs bigint 十进制文本），可直接对照证明逐位保真。
 * - `corpusDefect` 条目逐条重新判定：args/expected 子树内无「超安全浮点字面量」（原文已浮点化、
 *   无法恢复整数值）即可保真恢复 → 移除标注、恢复为可执行用例；否则保留标注并写明依据。
 *
 * 用法：
 *   node json_to_cases_ts.mjs <problem-dir> [--report <path>]
 *   node json_to_cases_ts.mjs <problem-dir> --check   # 校验现存 cases.ts 与重新生成逐字节一致
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';

const MAX_SAFE = 9007199254740991n;
const INTEGER_TEXT = /^-?\d+$/;

// ── tokenizer：字符串感知的 JSON 词法扫描 ──────────────────────────────────

function tokenize(text) {
    const tokens = [];
    let i = 0;
    const n = text.length;
    while (i < n) {
        const c = text[i];
        if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
            i++;
            continue;
        }
        if (c === '"') {
            const start = i;
            i++;
            while (i < n && text[i] !== '"') {
                if (text[i] === '\\') i++;
                i++;
            }
            i++;
            tokens.push({ kind: 'string', start, end: i, text: text.slice(start, i) });
            continue;
        }
        if (c === '-' || (c >= '0' && c <= '9')) {
            const start = i;
            if (text[i] === '-') i++;
            while (i < n && text[i] >= '0' && text[i] <= '9') i++;
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
            tokens.push({ kind: 'number', start, end: i, text: text.slice(start, i), isFloat });
            continue;
        }
        if ('{}[],:'.includes(c)) {
            tokens.push({ kind: 'punct', start: i, end: i + 1, text: c });
            i++;
            continue;
        }
        if (text.startsWith('true', i) || text.startsWith('false', i) || text.startsWith('null', i)) {
            const end = text.startsWith('true', i) ? i + 4 : text.startsWith('false', i) ? i + 5 : i + 4;
            tokens.push({ kind: 'literal', start: i, end, text: text.slice(i, end) });
            i = end;
            continue;
        }
        throw new Error(`json_to_cases_ts: 非法字符 ${JSON.stringify(c)} @ offset ${i}`);
    }
    return tokens;
}

// ── 带位置的递归解析（只为结构与 span，不取数值） ──────────────────────────

function parseNode(tokens, cursor) {
    const token = tokens[cursor];
    if (!token) throw new Error('json_to_cases_ts: 意外结束');
    if (token.kind === 'punct' && token.text === '{') {
        const entries = [];
        let at = cursor + 1;
        while (tokens[at] && !(tokens[at].kind === 'punct' && tokens[at].text === '}')) {
            const keyToken = tokens[at];
            if (keyToken.kind !== 'string') throw new Error(`对象键必须是字符串 @ offset ${keyToken.start}`);
            const colon = tokens[at + 1];
            if (!colon || colon.text !== ':') throw new Error(`对象键后缺冒号 @ offset ${keyToken.start}`);
            const value = parseNode(tokens, at + 2);
            entries.push({ key: JSON.parse(keyToken.text), keyStart: keyToken.start, value });
            at = value.end1;
            if (tokens[at] && tokens[at].text === ',') at++;
        }
        if (!tokens[at]) throw new Error('对象未闭合');
        return { type: 'object', start: token.start, end: tokens[at].end, entries, end1: at + 1 };
    }
    if (token.kind === 'punct' && token.text === '[') {
        const items = [];
        let at = cursor + 1;
        while (tokens[at] && !(tokens[at].kind === 'punct' && tokens[at].text === ']')) {
            const value = parseNode(tokens, at);
            items.push(value);
            at = value.end1;
            if (tokens[at] && tokens[at].text === ',') at++;
        }
        if (!tokens[at]) throw new Error('数组未闭合');
        return { type: 'array', start: token.start, end: tokens[at].end, items, end1: at + 1 };
    }
    return { type: token.kind, start: token.start, end: token.end, text: token.text, isFloat: token.isFloat, end1: cursor + 1 };
}

function parse(text) {
    const tokens = tokenize(text);
    const root = parseNode(tokens, 0);
    return { root, tokens };
}

// ── 语义无损判定与转换 ─────────────────────────────────────────────────────

function hasBareNumber(node) {
    if (node.type === 'number') return true;
    if (node.type === 'array') return node.items.some(hasBareNumber);
    if (node.type === 'object') return node.entries.some((entry) => hasBareNumber(entry.value));
    return false;
}

function collectConversions(node, context, text, edits, conversions) {
    if (node.type === 'number') {
        if (node.isFloat) return;
        const digits = node.text;
        const value = BigInt(digits);
        if (value > MAX_SAFE || value < -MAX_SAFE) {
            if (value.toString() !== digits) {
                throw new Error(`整数字面量 ${digits} 无法逐字保真（@ offset ${node.start}）`);
            }
            edits.push({ start: node.start, end: node.end, text: `${digits}n` });
            conversions.push({ offset: node.start, context, original: digits, bigintText: value.toString() });
        }
        return;
    }
    if (node.type === 'string') {
        if (!context.integerCarrier) return;
        const content = JSON.parse(node.text);
        if (typeof content !== 'string' || !INTEGER_TEXT.test(content)) return;
        const value = BigInt(content);
        if (value > MAX_SAFE || value < -MAX_SAFE) {
            if (value.toString() !== content) {
                // 如 "007"：字符串并非整数的逐字编码，保留字符串形态。
                return;
            }
            edits.push({ start: node.start, end: node.end, text: `${content}n` });
            conversions.push({ offset: node.start, context, original: node.text, bigintText: value.toString() });
        }
        return;
    }
    if (node.type === 'array') {
        for (const item of node.items) collectConversions(item, context, text, edits, conversions);
        return;
    }
    if (node.type === 'object') {
        for (const entry of node.entries) collectConversions(entry.value, context, text, edits, conversions);
    }
}

function hasPrecisionLossFloat(node) {
    if (node.type === 'number' && node.isFloat) {
        const magnitude = Math.abs(Number(node.text));
        if (!Number.isFinite(magnitude) || magnitude > 9007199254740991) return true;
        return false;
    }
    if (node.type === 'array') return node.items.some(hasPrecisionLossFloat);
    if (node.type === 'object') return node.entries.some((entry) => hasPrecisionLossFloat(entry.value));
    return false;
}

function findEntry(objectNode, key) {
    return objectNode.entries.find((entry) => entry.key === key) ?? null;
}

function convert(problemDir, sourceText) {
    const { root } = parse(sourceText);
    if (root.type !== 'object') throw new Error('metadata.json 顶层必须是对象');
    const testsEntry = findEntry(root, 'tests');
    if (!testsEntry || testsEntry.value.type !== 'array' || testsEntry.value.items.length === 0) {
        throw new Error('metadata.tests 为空或缺失');
    }
    const tests = testsEntry.value;

    // 第一趟：按键做整数型推断（任一同键出现裸数值即整数型；与 harness 的 inferIntegerArgKeys 同口径）。
    const integerKeys = new Set();
    let expectedIntegerCarrier = false;
    for (const [caseIndex, caseNode] of tests.items.entries()) {
        if (caseNode.type !== 'object') throw new Error(`tests[${caseIndex}] 必须是对象`);
        const args = findEntry(caseNode, 'args');
        if (!args || args.value.type !== 'object') throw new Error(`tests[${caseIndex}].args 必须是对象`);
        for (const argEntry of args.value.entries) {
            if (hasBareNumber(argEntry.value)) integerKeys.add(argEntry.key);
        }
        const expected = findEntry(caseNode, 'expected');
        if (expected && hasBareNumber(expected.value)) expectedIntegerCarrier = true;
    }

    // 第二趟：逐字转换 + corpusDefect 逐条重判。
    const edits = [];
    const conversions = [];
    const defectDecisions = [];
    for (const [caseIndex, caseNode] of tests.items.entries()) {
        const args = findEntry(caseNode, 'args').value;
        for (const argEntry of args.entries) {
            collectConversions(
                argEntry.value,
                { place: 'args', key: argEntry.key, integerCarrier: integerKeys.has(argEntry.key), caseIndex },
                sourceText,
                edits,
                conversions,
            );
        }
        const expectedEntry = findEntry(caseNode, 'expected');
        if (expectedEntry) {
            collectConversions(
                expectedEntry.value,
                { place: 'expected', key: null, integerCarrier: expectedIntegerCarrier, caseIndex },
                sourceText,
                edits,
                conversions,
            );
        }
        const defectEntry = findEntry(caseNode, 'corpusDefect');
        if (defectEntry) {
            const carriers = [args, ...(expectedEntry ? [expectedEntry.value] : [])];
            const unrecoverable = carriers.some(hasPrecisionLossFloat);
            if (unrecoverable) {
                defectDecisions.push({
                    caseIndex,
                    recovered: false,
                    reason: '原文含超安全浮点字面量（精度已在 JSON 原文丢失），无法保真恢复原值，保留 corpusDefect 标注',
                });
            } else {
                // 移除 `corpusDefect` 属性（连同相邻一个逗号）。
                let start = defectEntry.keyStart;
                let end = defectEntry.value.end;
                const after = sourceText.slice(end);
                const commaAfter = after.match(/^\s*,/);
                if (commaAfter) {
                    end += commaAfter[0].length;
                } else {
                    const before = sourceText.slice(0, start);
                    const commaBefore = before.match(/,\s*$/);
                    if (commaBefore) start -= commaBefore[0].length;
                }
                edits.push({ start, end, text: '' });
                defectDecisions.push({
                    caseIndex,
                    recovered: true,
                    reason: '原文整数字面量逐字保真，恢复为可执行用例并移除 corpusDefect 标注',
                });
            }
        }
    }

    const sorted = edits.sort((a, b) => b.start - a.start);
    let slice = sourceText.slice(tests.start, tests.end);
    for (const edit of sorted) {
        slice = slice.slice(0, edit.start - tests.start) + edit.text + slice.slice(edit.end - tests.start);
    }
    return { testsSlice: slice, conversions, defectDecisions, caseCount: tests.items.length };
}

function emitModule(problemDir, converted, casesModuleOverride) {
    const outPath = join(problemDir, `${basename(problemDir)}.cases.ts`);
    const casesModule =
        casesModuleOverride ??
        relative(problemDir, join(problemDir, '..', '..', 'conformance', 'src', 'isolated', 'cases.ts')).replaceAll('\\', '/');
    const body =
        '// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。\n' +
        `import type { ProblemCases } from '${casesModule}';\n\n` +
        `export const cases: ProblemCases = ${converted.testsSlice};\n`;
    return { outPath, body };
}

function main() {
    const args = process.argv.slice(2);
    const problemDir = args[0];
    if (!problemDir) {
        console.error('usage: json_to_cases_ts.mjs <problem-dir> [--check] [--report <path>]');
        process.exit(2);
    }
    const checkMode = args.includes('--check');
    const reportIndex = args.indexOf('--report');
    const reportPath = reportIndex >= 0 ? args[reportIndex + 1] : null;
    const moduleIndex = args.indexOf('--cases-module');
    const casesModuleOverride = moduleIndex >= 0 ? args[moduleIndex + 1] : undefined;

    const metaPath = join(problemDir, 'metadata.json');
    const sourceText = readFileSync(metaPath, 'utf8');
    const converted = convert(problemDir, sourceText);
    const { outPath, body } = emitModule(problemDir, converted, casesModuleOverride);

    const summary = {
        slug: basename(problemDir),
        cases: converted.caseCount,
        sourceBytes: Buffer.byteLength(sourceText, 'utf8'),
        outBytes: Buffer.byteLength(body, 'utf8'),
        conversions: converted.conversions.length,
        defectRecovered: converted.defectDecisions.filter((d) => d.recovered).length,
        defectKept: converted.defectDecisions.filter((d) => !d.recovered).length,
    };

    const writeReport = () => {
        if (reportPath) {
            writeFileSync(
                reportPath,
                JSON.stringify({ ...summary, conversions: converted.conversions, defectDecisions: converted.defectDecisions }, null, 2) + '\n',
                'utf8',
            );
        }
    };

    if (checkMode) {
        if (!existsSync(outPath)) {
            console.error(`--check 失败：${outPath} 不存在`);
            process.exit(1);
        }
        const existing = readFileSync(outPath, 'utf8');
        if (existing !== body) {
            console.error(`--check 失败：${outPath} 与 metadata.json 重新生成结果不一致`);
            process.exit(1);
        }
        writeReport();
        console.log(JSON.stringify({ ...summary, check: 'identical' }));
        return;
    }

    writeFileSync(outPath, body, 'utf8');
    console.log(JSON.stringify({ ...summary, out: outPath }));
    writeReport();
}

main();
