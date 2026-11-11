/**
 * guest trap 与宿主侧异常的分类（验收观察门）。
 *
 * 预期 trap 只接受明确的 guest trap 类型与原因：
 * - `wasm-runtime-error`：`WebAssembly.RuntimeError`（unreachable、越界、整数溢出等 wasm 原生 trap）。
 * - `guest-raise`：guest 未捕获 `raise` 经 node glue 的 `host_raise` 宿主导入还原出的
 *   `Error`（栈中可见 `host_raise` 帧，message 为 guest 文本 payload）。
 *
 * glue/ABI/JS TypeError/归一化错误等宿主侧异常不得判为通过。glue 的 marshal/demarshal
 * 发生在 `callExport` 调用窗口内，因此按错误内容把异常归回真实阶段，而不是笼统记 invoke。
 */

export type ObservationPhase = 'marshal' | 'guest-invoke' | 'demarshal-normalize';

export type ThrownClassification =
    | { kind: 'guest-trap'; trapKind: 'wasm-runtime-error' | 'guest-raise'; reason: string }
    | { kind: 'host-anomaly'; phase: ObservationPhase; detail: string };

const HOST_RAISE_FRAME = /(^|\n|\s|at )host_raise\b/;

function errorDetail(err: unknown): string {
    if (err instanceof Error) {
        return `${err.name}: ${err.message}`;
    }
    return String(err);
}

function messageOf(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

/**
 * 按抛出阶段与错误内容分类。`thrownIn` 是宿主观测到的抛出窗口；
 * glue 内容特征（`Cannot marshal` / `Cannot demarshal`）会把阶段修正回真实边界。
 */
export function classifyThrown(err: unknown, thrownIn: ObservationPhase): ThrownClassification {
    if (thrownIn === 'guest-invoke') {
        if (err instanceof WebAssembly.RuntimeError) {
            return { kind: 'guest-trap', trapKind: 'wasm-runtime-error', reason: err.message };
        }
        const stack = err instanceof Error && typeof err.stack === 'string' ? err.stack : '';
        if (stack.includes('host_raise') && HOST_RAISE_FRAME.test(stack)) {
            return { kind: 'guest-trap', trapKind: 'guest-raise', reason: err instanceof Error ? err.message : String(err) };
        }
        const message = messageOf(err);
        if (message.includes('Cannot marshal')) {
            return { kind: 'host-anomaly', phase: 'marshal', detail: errorDetail(err) };
        }
        if (message.includes('Cannot demarshal')) {
            return { kind: 'host-anomaly', phase: 'demarshal-normalize', detail: errorDetail(err) };
        }
    }
    return { kind: 'host-anomaly', phase: thrownIn, detail: errorDetail(err) };
}
