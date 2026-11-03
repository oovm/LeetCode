// 反例 fixture：解法在模块装载时直接终止进程，判题器必须报 solver_exit。
process.exit(1);

export class Solution {
    echoPlusOne(n: number): number {
        return n + 1;
    }
}
