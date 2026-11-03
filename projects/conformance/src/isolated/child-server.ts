/**
 * 解法子进程的 stdio 服务循环：NDJSON 进、NDJSON 出，消息按到达顺序串行处理。
 * Node 与 Bun 都支持 `process.stdin` 的 data 事件，故同一实现跑两个运行时。
 */
import { createLineAssembler, decodeLine, encodeLine, type JudgeMessage, type SolverMessage } from './protocol.ts';

export type LoadHandler = (message: Extract<JudgeMessage, { type: 'load' }>) => Promise<Record<string, unknown> | void>;
export type RunHandler = (message: Extract<JudgeMessage, { type: 'run' }>) => Promise<SolverMessage>;

export function serveChild(load: LoadHandler, run: RunHandler): void {
    const send = (message: SolverMessage): void => {
        process.stdout.write(encodeLine(message));
    };

    let chain = Promise.resolve();
    const dispatch = async (message: JudgeMessage): Promise<void> => {
        if (message.type === 'load') {
            try {
                const extra = await load(message);
                send({ type: 'ready', ...(extra ?? {}) });
            } catch (err) {
                send({ type: 'error', stage: 'load', message: err instanceof Error ? err.message : String(err) });
            }
            return;
        }
        if (message.type === 'run') {
            try {
                send(await run(message));
            } catch (err) {
                send({ type: 'error', stage: 'run', message: err instanceof Error ? err.message : String(err) });
            }
            return;
        }
        if (message.type === 'bye') {
            process.exit(0);
        }
    };

    process.stdin.setEncoding('utf8');
    process.stdin.on(
        'data',
        createLineAssembler((line) => {
            let message: JudgeMessage;
            try {
                message = decodeLine(line) as JudgeMessage;
            } catch (err) {
                send({ type: 'error', stage: 'run', message: err instanceof Error ? err.message : String(err) });
                return;
            }
            chain = chain.then(() => dispatch(message));
        }),
    );
}
