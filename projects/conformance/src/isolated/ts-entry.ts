/**
 * TS 解法入口解析（隔离子进程侧的最小实现）。
 *
 * 与 `adapters/typescript-node/ref.ts` 的 `makeTsCandidate` 同语义：
 * `Solution().twoSum` 形态实例化 `export class Solution` 并取方法；裸名形态取导出函数。
 * 单独成模块是为了让子进程脚本不依赖 `@nyar/valkyrie` 等重依赖（Bun 进程同样直载本文件）。
 */

export type Candidate = (args: Record<string, unknown>) => unknown;

/** 按 `invoke.typescript` 入口表达式构造调用闭包。 */
export function makeCandidate(entryPoint: string, mod: Record<string, unknown>): Candidate {
    const expr = entryPoint.trim();
    const classMethod = expr.match(/^Solution\(\)\.(\w+)$/);
    if (classMethod) {
        const method = classMethod[1];
        const Solution = mod.Solution;
        if (typeof Solution !== 'function') {
            throw new Error('solution.ts 缺少 export class Solution');
        }
        return (args) => {
            const instance = new (Solution as new () => Record<string, (...values: unknown[]) => unknown>)();
            const fn = instance[method];
            if (typeof fn !== 'function') {
                throw new Error(`Solution 缺少方法 ${method}`);
            }
            return fn.call(instance, ...Object.values(args));
        };
    }
    const exported = mod[expr];
    if (typeof exported === 'function') {
        return (args) => exported(...Object.values(args));
    }
    throw new Error(`不支持的 typescript entry: ${expr}`);
}
