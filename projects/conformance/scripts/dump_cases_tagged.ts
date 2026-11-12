#!/usr/bin/env node
/**
 * 把 `<slug>.cases.ts` 装载快照以 tagged NDJSON 形式输出到 stdout，供非 TS 直接 lane（如 Python 参考解）
 * 按协议解码。第一行是 header（含快照文件内容摘要 `sourceDigest`），其后每条可执行用例一行，
 * `corpusDefect` 条目逐例输出 `excluded` 行（携带排除依据）；`bigint` 以 `{"$bigint": "<十进制>"}` 传输。
 * 用例行的 `index` 是装载快照冻结的 `sourceIndex`（原始下标），Python 侧必须按该坐标报告失败，
 * 不得按接收顺序重新编号；判题分母 = `case` 行（可执行子集）。
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

const snapshot = loadProblemCases(problemDir);
const slug = problemIdFromDir(problemDir);

const header = {
    type: 'header',
    slug,
    source: snapshot.source,
    sourceDigest: snapshot.sourceDigest,
    total: snapshot.executableEntries.length,
    defectSkipped: snapshot.excludedEntries.length,
};
process.stdout.write(JSON.stringify(header) + '\n');

for (const entry of snapshot.excludedEntries) {
    process.stdout.write(
        JSON.stringify({
            type: 'excluded',
            index: entry.sourceIndex,
            caseId: entry.caseId,
            digest: entry.digest,
            exclusion: entry.exclusion,
        }) + '\n',
    );
}

for (const entry of snapshot.executableEntries) {
    const line = {
        type: 'case',
        index: entry.sourceIndex,
        caseId: entry.caseId,
        digest: entry.digest,
        args: encodeValue(entry.case.args, `cases[${entry.sourceIndex}].args`),
        expected: encodeValue(entry.case.expected, `cases[${entry.sourceIndex}].expected`),
    };
    process.stdout.write(JSON.stringify(line) + '\n');
}
