import { createHash } from 'node:crypto';

export type RunIdInputs = {
    problemId: string;
    implementationId: string;
    mode: 'correctness' | 'benchmark';
    sourceDigest: string;
    adapterVersion: string;
    toolchainKey: string;
    measurementPlanKey: string;
    executionNonce: string;
};

/** 与 benchmark/correctness manifest 一致的题目源码摘要；`bigint` 用例值按 `<十进制>n` 稳定序列化。 */
export function problemSourceDigest(problemId: string, implementationId: string, tests: unknown[]): string {
    const serialized = JSON.stringify(tests, (_key, value: unknown) => (typeof value === 'bigint' ? `${value}n` : value));
    return digestSource([problemId, implementationId, serialized]);
}

export function digestSource(parts: string[]): string {
    const hash = createHash('sha256');
    for (const part of parts) {
        hash.update(part);
        hash.update('\0');
    }
    return hash.digest('hex').slice(0, 16);
}

export function buildRunId(inputs: RunIdInputs): string {
    const hash = createHash('sha256');
    const payload = [
        inputs.problemId,
        inputs.implementationId,
        inputs.mode,
        inputs.sourceDigest,
        inputs.adapterVersion,
        inputs.toolchainKey,
        inputs.measurementPlanKey,
        inputs.executionNonce,
    ].join('|');
    hash.update(payload);
    return hash.digest('hex').slice(0, 20);
}
