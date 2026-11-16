#!/usr/bin/env node
// 唯一 catalog 生成/校验入口：`projects/problems/<slug>/metadata.json` + `readme.md`
// 是题目身份的唯一事实源，`projects/conformance/src/catalog/generated.ts` 由本脚本
// 生成，禁止手工维护第二份题单。
//
// 用法：
//   node scripts/catalog.mjs --write   # 重新生成 generated.ts
//   node scripts/catalog.mjs --check   # 校验现有文件与目录事实一致（CI 门）
//
// 分类报告：
//   - catalog 条目：有 `metadata.json` 的目录（id 必须等于目录名）。
//   - 脚手架清单：无 `metadata.json` 的目录，单列输出、不静默丢弃，也不计入 catalog。
//   - 判题用例：`<slug>.cases.ts` 存在与否单独统计，缺用例不阻止入册但会列出。

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PROBLEMS_DIR = join(ROOT, 'projects', 'problems');
const GENERATED = join(ROOT, 'projects', 'conformance', 'src', 'catalog', 'generated.ts');

const HEADER = [
    '/** 题目目录索引，勿手改。 */',
    '',
    'export type ProblemDefinition = {',
    '    id: string;',
    '    title: string;',
    '    questionId: number;',
    '    difficulty: string;',
    '    tags: string[];',
    '};',
    '',
    'export const PROBLEMS: ProblemDefinition[] = [',
].join('\n');

function readTitle(slug) {
    const readmePath = join(PROBLEMS_DIR, slug, 'readme.md');
    if (!existsSync(readmePath)) {
        return { title: null, error: `缺少 readme.md：无法提取 title（首行须为 \`# [Title](url)\`）` };
    }
    const firstLine = readFileSync(readmePath, 'utf8').split('\n', 1)[0];
    // 教练稿：`# [Title](https://leetcode.com/problems/<slug>/)`；旧稿：`# Title`。
    const linked = firstLine.match(/^# \[(.+)\]\(https:\/\/leetcode\.com\/problems\/[^/]+\/?\)/);
    if (linked) {
        return { title: linked[1], error: null };
    }
    const plain = firstLine.match(/^# (.+)$/);
    if (plain) {
        return { title: plain[1].trim(), error: null };
    }
    return { title: null, error: `readme.md 首行不是 \`# [Title](url)\` 或 \`# Title\` 形式：${firstLine.slice(0, 60)}` };
}

function collect() {
    const slugs = readdirSync(PROBLEMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();
    const entries = [];
    const scaffolds = [];
    const missingCases = [];
    const problems = [];
    for (const slug of slugs) {
        const metaPath = join(PROBLEMS_DIR, slug, 'metadata.json');
        if (!existsSync(metaPath)) {
            scaffolds.push(slug);
            continue;
        }
        let meta;
        try {
            meta = JSON.parse(readFileSync(metaPath, 'utf8'));
        } catch (error) {
            problems.push(`metadata.json 解析失败 ${slug}: ${error.message}`);
            continue;
        }
        if (meta.id !== slug) {
            problems.push(`metadata.id 与目录名不一致：${slug} != ${String(meta.id)}`);
            continue;
        }
        if (!Number.isInteger(meta.questionId) || meta.questionId <= 0) {
            problems.push(`${slug}: questionId 缺失或非正整数`);
            continue;
        }
        if (typeof meta.difficulty !== 'string' || meta.difficulty.length === 0) {
            problems.push(`${slug}: difficulty 缺失`);
            continue;
        }
        if (!Array.isArray(meta.tags)) {
            problems.push(`${slug}: tags 缺失或非数组`);
            continue;
        }
        const { title, error } = readTitle(slug);
        if (error) {
            problems.push(`${slug}: ${error}`);
            continue;
        }
        if (!existsSync(join(PROBLEMS_DIR, slug, `${slug}.cases.ts`))) {
            missingCases.push(slug);
        }
        entries.push({ id: slug, title, questionId: meta.questionId, difficulty: meta.difficulty, tags: meta.tags });
    }
    entries.sort((left, right) => left.questionId - right.questionId);
    const seen = new Map();
    for (const entry of entries) {
        const previous = seen.get(entry.questionId);
        if (previous) {
            problems.push(`questionId 重复：${previous} 与 ${entry.id} 都是 ${entry.questionId}`);
        }
        seen.set(entry.questionId, entry.id);
    }
    return { entries, scaffolds, missingCases, problems };
}

function render(entries) {
    const body = entries
        .map(
            (entry) =>
                `    {\n        id: '${entry.id}',\n        title: '${entry.title.replace(/'/g, "\\'")}',\n        questionId: ${entry.questionId},\n        difficulty: '${entry.difficulty}',\n        tags: [${entry.tags.map((tag) => `'${tag}'`).join(', ')}],\n    },`,
        )
        .join('\n');
    return `${HEADER}\n${body}\n];\n`;
}

function report({ entries, scaffolds, missingCases, problems }) {
    console.log(`catalog 条目：${entries.length}`);
    console.log(`脚手架目录（无 metadata.json，单列不入册）：${scaffolds.length}`);
    if (scaffolds.length > 0) {
        console.log(scaffolds.map((slug) => `  - ${slug}`).join('\n'));
    }
    console.log(`缺 <slug>.cases.ts 判题用例：${missingCases.length}`);
    if (missingCases.length > 0) {
        console.log(missingCases.map((slug) => `  - ${slug}`).join('\n'));
    }
    if (problems.length > 0) {
        console.error(`身份问题 ${problems.length} 项：`);
        console.error(problems.map((line) => `  ! ${line}`).join('\n'));
    }
}

const { entries, scaffolds, missingCases, problems, } = collect();
report({ entries, scaffolds, missingCases, problems });
if (problems.length > 0) {
    console.error('存在身份问题，拒绝生成/校验。');
    process.exit(1);
}

const rendered = render(entries);
const mode = process.argv[2];
if (mode === '--write') {
    writeFileSync(GENERATED, rendered, 'utf8');
    console.log(`已写入 projects/conformance/src/catalog/generated.ts（${entries.length} 条）`);
} else if (mode === '--check') {
    const current = existsSync(GENERATED) ? readFileSync(GENERATED, 'utf8') : '';
    if (current !== rendered) {
        console.error('catalog/generated.ts 与目录事实不一致：运行 `node scripts/catalog.mjs --write` 重新生成。');
        process.exit(1);
    }
    console.log('catalog 校验通过：generated.ts 与目录事实一致。');
} else {
    console.log('（未指定 --write/--check，仅输出分类报告）');
}
