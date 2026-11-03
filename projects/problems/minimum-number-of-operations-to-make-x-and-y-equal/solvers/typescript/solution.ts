export class Solution {
    minimumOperationsToMakeEqual(x: number, y: number): number {
        if (x <= y) {
            return y - x;
        }
        const memo = new Map<number, number>();
        const solve = (current: number): number => {
            if (current <= y) {
                return y - current;
            }
            const cached = memo.get(current);
            if (cached !== undefined) {
                return cached;
            }
            let best = current - y;
            for (const divisor of [5, 11]) {
                best = Math.min(best, 1 + (current % divisor) + solve(Math.floor(current / divisor)));
                best = Math.min(best, 1 + (divisor - (current % divisor)) + solve(Math.ceil(current / divisor)));
            }
            memo.set(current, best);
            return best;
        };
        return solve(x);
    }
}
