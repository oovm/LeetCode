/**
 * 「未溯源的 expected 不得计入绿」门禁。
 *
 * - 现存 metadata 里不允许再有未登记的异常文本 expected；
 * - 所有仍存在的异常文本必须逐条命中 `expected-provenance.json` 的 `untraced` 记录；
 * - `untraced` 所在题目不得出现在覆盖清单的 `coverageEligible: true` 条目里。
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { CONFORMANCE_ROOT, LEETCODE_ROOT } from '../src/domain/paths.ts';

type ProvenanceEntry = { problemId: string; caseIndex: number; provenance: string; disposition: string };
type ProvenanceReport = { entries: ProvenanceEntry[]; summary: { abnormalExpected: number; retainedAbnormalExpected: number } };
type CoverageEntry = { id: string; expectedProvenance?: string; coverageEligible?: boolean };
type CoverageManifest = { batches: Array<{ problems: CoverageEntry[] }> };

const PROBLEMS_DIR = join(LEETCODE_ROOT, 'projects', 'problems');

function isAbnormalExpected(value: unknown): value is string {
    return typeof value === 'string' && (value.startsWith('Error:') || value === 'Execution timed out');
}

describe('expected 溯源门禁', () => {
    it('现存异常文本 expected 必须全部登记为 untraced', () => {
        const report = JSON.parse(
            readFileSync(join(CONFORMANCE_ROOT, 'reports', 'expected-provenance.json'), 'utf8'),
        ) as ProvenanceReport;
        const untraced = new Set(
            report.entries
                .filter((entry) => entry.provenance === 'untraced')
                .map((entry) => `${entry.problemId}#${entry.caseIndex}`),
        );

        const found: string[] = [];
        for (const problemId of readdirSync(PROBLEMS_DIR)) {
            const metadataPath = join(PROBLEMS_DIR, problemId, 'metadata.json');
            let metadata: { tests?: Array<{ expected?: unknown }> };
            try {
                metadata = JSON.parse(readFileSync(metadataPath, 'utf8')) as typeof metadata;
            } catch {
                continue;
            }
            for (const [index, test] of (metadata.tests ?? []).entries()) {
                if (isAbnormalExpected(test.expected)) {
                    found.push(`${problemId}#${index}`);
                }
            }
        }

        expect(found.length).toBe(report.summary.retainedAbnormalExpected);
        expect(found.filter((key) => !untraced.has(key))).toEqual([]);
    });

    it('untraced 题目不得标记 coverageEligible', () => {
        const report = JSON.parse(
            readFileSync(join(CONFORMANCE_ROOT, 'reports', 'expected-provenance.json'), 'utf8'),
        ) as ProvenanceReport;
        const manifest = JSON.parse(
            readFileSync(join(CONFORMANCE_ROOT, 'coverage', 'verified-problems.json'), 'utf8'),
        ) as CoverageManifest;
        const untracedProblems = new Set(
            report.entries.filter((entry) => entry.provenance === 'untraced').map((entry) => entry.problemId),
        );
        const eligible = manifest.batches.flatMap((batch) => batch.problems).filter((entry) => entry.coverageEligible);

        expect(eligible.filter((entry) => untracedProblems.has(entry.id))).toEqual([]);
    });
});
