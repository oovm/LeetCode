import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { ProblemSpec, TestCase } from './problem.ts';

export function loadProblemMetadata(problemRoot: string): Pick<ProblemSpec, 'tests' | 'invoke'> {
    const meta = JSON.parse(readFileSync(join(problemRoot, 'metadata.json'), 'utf8')) as {
        tests?: TestCase[];
        invoke?: Record<string, string | undefined>;
    };
    const tests = meta.tests;
    if (!tests?.length) {
        throw new Error('metadata.tests 为空');
    }
    return { tests, invoke: meta.invoke ?? {} };
}

export function requireInvoke(metadata: Pick<ProblemSpec, 'invoke'>, key: string): string {
    const value = metadata.invoke[key]?.trim();
    if (!value) {
        throw new Error(`metadata.invoke.${key} 缺失`);
    }
    return value;
}

/** 从题目目录读取 `metadata.id`（目录名 = slug = id 的仓内约定由 metadata 兜底校验）。 */
export function problemIdFromDir(problemRoot: string): string {
    const meta = JSON.parse(readFileSync(join(problemRoot, 'metadata.json'), 'utf8')) as { id?: string };
    const id = meta.id?.trim();
    if (!id) {
        throw new Error(`metadata.id 缺失：${problemRoot}`);
    }
    return id;
}
