#!/usr/bin/env node
/**
 * 把 `<slug>.cases.ts` 用例以 tagged NDJSON 形式输出到 stdout，供非 TS 直接 lane（如 Python 参考解）
 * 按协议解码。第一行是 header，其后每行一条可执行用例；`bigint` 以 `{"$bigint": "<十进制>"}` 传输，
 * 缺陷用例不进输出（判题分母 = 可执行子集）。
 *
 * 用法：`node --import tsx scripts/dump_cases_tagged.ts <problem-dir>`
 */
import { loadProblemCases } from '../src/domain/cases-loader.ts';
import { problemIdFromDir } from '../src/domain/metadata.ts';
import { encodeValue } from '../src/isolated/protocol.ts';

const problemDir = process.argv[2];
if (!problemDir) {
    process.stderr.write('usage: dump_cases_tagged.ts <problem-dir>\n');
    process.exit(2);
}

const loaded = loadProblemCases(problemDir);
const slug = problemIdFromDir(problemDir);

const header = {
    type: 'header',
    slug,
    source: loaded.source,
    total: loaded.executable.length,
    defectSkipped: loaded.defectSkipped,
};
process.stdout.write(JSON.stringify(header) + '\n');

for (const [index, case_] of loaded.executable.entries()) {
    const line = {
        type: 'case',
        index,
        args: encodeValue(case_.args, `cases[${index}].args`),
        expected: encodeValue(case_.expected, `cases[${index}].expected`),
    };
    process.stdout.write(JSON.stringify(line) + '\n');
}
