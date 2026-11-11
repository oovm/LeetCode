/**
 * 场景用例的分阶段观测执行器（[01 §4.12] 验收观察门）。
 *
 * marshal、guest invoke、demarshal-normalize 三个阶段独立报告；预期 trap 只接受
 * `guest-trap.ts` 认定的明确 guest trap 类型与原因，宿主侧异常永不判为通过。
 * 每条结果携带稳定 case identity 与内容摘要，逐例状态由本例真实观测得出，
 * 禁止从汇总计数倒推。
 */
import { orderArgsBySchema, type LibraryInvokeSchema } from '../adapters/valkyrie-node/abi.ts';
import { normalizeTsTestResult } from '../domain/assert.ts';
import { formatValue, resultsMatch } from '../domain/compare-mode.ts';
import { normalizeResultByAbiType } from '../isolated/v-shared.ts';
import { sceneCaseDigest, sceneCaseId } from './case-identity.ts';
import { classifyThrown, type ObservationPhase } from './guest-trap.ts';

export type SceneCase = { export: string; expected: unknown; note?: string };

export type SceneInvokeHost = { callExport?: (name: string, ...args: unknown[]) => unknown };

export type PhaseOutcome =
    | { status: 'ok' }
    | { status: 'skipped' }
    | { status: 'guest-trap'; trapKind: string; reason: string }
    | { status: 'host-anomaly'; phase: ObservationPhase; detail: string }
    | { status: 'mismatch'; detail: string };

export type SceneCaseResult = {
    caseId: string;
    caseDigest: string;
    verdict: 'pass' | 'fail';
    failure: string | null;
    phases: {
        marshal: PhaseOutcome;
        invoke: PhaseOutcome;
        demarshal: PhaseOutcome;
    };
};

function fail(caseId: string, caseDigest: string, failure: string, phases: SceneCaseResult['phases']): SceneCaseResult {
    return { caseId, caseDigest, verdict: 'fail', failure, phases };
}

/**
 * 逐阶段执行一个场景用例。
 *
 * 场景入口按约定无实参：marshal 阶段以空 args 走 schema 参数合同（schema 声明了
 * 参数而场景未供货时在此结构化失败）；glue 的 marshal/demarshal 异常发生在
 * `callExport` 窗口内，由 `classifyThrown` 按内容修正真实阶段。
 */
export async function runSceneCase(
    host: SceneInvokeHost,
    schema: LibraryInvokeSchema,
    sceneId: string,
    testCase: SceneCase,
): Promise<SceneCaseResult> {
    const caseId = sceneCaseId(sceneId, testCase.export);
    const caseDigest = sceneCaseDigest(testCase);

    const exportSchema = schema.exports[testCase.export];
    if (!exportSchema) {
        const detail = `ABI schema 里没有该导出：${testCase.export}`;
        return fail(caseId, caseDigest, `HOST-ANOMALY phase=marshal: ${detail}`, {
            marshal: { status: 'host-anomaly', phase: 'marshal', detail },
            invoke: { status: 'skipped' },
            demarshal: { status: 'skipped' },
        });
    }

    let ordered: unknown[];
    try {
        ordered = orderArgsBySchema(exportSchema, {});
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        return fail(caseId, caseDigest, `HOST-ANOMALY phase=marshal: ${detail}`, {
            marshal: { status: 'host-anomaly', phase: 'marshal', detail },
            invoke: { status: 'skipped' },
            demarshal: { status: 'skipped' },
        });
    }

    let raw: unknown;
    try {
        const called = host.callExport!(testCase.export, ...ordered);
        raw = called instanceof Promise ? await called : called;
    } catch (err) {
        const classified = classifyThrown(err, 'guest-invoke');
        if (classified.kind === 'guest-trap') {
            if (testCase.expected === 'trap') {
                return {
                    caseId,
                    caseDigest,
                    verdict: 'pass',
                    failure: null,
                    phases: {
                        marshal: { status: 'ok' },
                        invoke: { status: 'guest-trap', trapKind: classified.trapKind, reason: classified.reason },
                        demarshal: { status: 'skipped' },
                    },
                };
            }
            return fail(caseId, caseDigest, `unexpected guest trap ${classified.trapKind}: ${classified.reason}`, {
                marshal: { status: 'ok' },
                invoke: { status: 'guest-trap', trapKind: classified.trapKind, reason: classified.reason },
                demarshal: { status: 'skipped' },
            });
        }
        const anomalyPhase = classified.phase;
        const detail = `HOST-ANOMALY phase=${anomalyPhase}: ${classified.detail}`;
        return fail(caseId, caseDigest, detail, {
            marshal: anomalyPhase === 'marshal' ? { status: 'host-anomaly', phase: anomalyPhase, detail: classified.detail } : { status: 'ok' },
            invoke:
                anomalyPhase === 'guest-invoke'
                    ? { status: 'host-anomaly', phase: anomalyPhase, detail: classified.detail }
                    : { status: 'skipped' },
            demarshal:
                anomalyPhase === 'demarshal-normalize'
                    ? { status: 'host-anomaly', phase: anomalyPhase, detail: classified.detail }
                    : { status: 'skipped' },
        });
    }

    let actual: unknown;
    let normalizedExpected: unknown;
    try {
        const returns = exportSchema.returns;
        actual = normalizeResultByAbiType(normalizeTsTestResult(raw), returns);
        normalizedExpected =
            testCase.expected === 'trap' ? 'trap' : normalizeResultByAbiType(normalizeTsTestResult(testCase.expected), returns);
    } catch (err) {
        const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        return fail(caseId, caseDigest, `HOST-ANOMALY phase=demarshal-normalize: ${detail}`, {
            marshal: { status: 'ok' },
            invoke: { status: 'ok' },
            demarshal: { status: 'host-anomaly', phase: 'demarshal-normalize', detail },
        });
    }

    if (testCase.expected === 'trap') {
        return fail(caseId, caseDigest, `expected trap, got value ${formatValue(actual)}`, {
            marshal: { status: 'ok' },
            invoke: { status: 'ok' },
            demarshal: { status: 'mismatch', detail: `expected trap, got value` },
        });
    }

    if (resultsMatch(actual, normalizedExpected, 'strict')) {
        return {
            caseId,
            caseDigest,
            verdict: 'pass',
            failure: null,
            phases: { marshal: { status: 'ok' }, invoke: { status: 'ok' }, demarshal: { status: 'ok' } },
        };
    }
    const detail = `expected ${formatValue(normalizedExpected)}, got ${formatValue(actual)}`;
    return fail(caseId, caseDigest, detail, {
        marshal: { status: 'ok' },
        invoke: { status: 'ok' },
        demarshal: { status: 'mismatch', detail },
    });
}

function formatPhaseOutcome(outcome: PhaseOutcome): string {
    switch (outcome.status) {
        case 'ok':
            return 'ok';
        case 'skipped':
            return 'skipped';
        case 'guest-trap':
            return `guest-trap(${outcome.trapKind}: ${outcome.reason})`;
        case 'host-anomaly':
            return `host-anomaly(${outcome.detail})`;
        case 'mismatch':
            return `mismatch(${outcome.detail})`;
    }
}

/** 逐例结果行：身份、摘要前缀与三个阶段各自独立可见。 */
export function formatSceneCaseLine(result: SceneCaseResult): string {
    const head = `${result.verdict === 'pass' ? 'PASS' : 'FAIL'} ${result.caseId} digest=${result.caseDigest.slice(0, 12)}`;
    const phases = `marshal=${formatPhaseOutcome(result.phases.marshal)} invoke=${formatPhaseOutcome(result.phases.invoke)} demarshal=${formatPhaseOutcome(result.phases.demarshal)}`;
    return `  ${head} ${phases}${result.failure === null ? '' : ` -> ${result.failure}`}`;
}
