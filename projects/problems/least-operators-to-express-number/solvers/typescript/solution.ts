export class Solution {
    leastOpsExpressTarget(x: number, target: number): number {
        const memo = new Map<number, number>();
        const solve = (rest: number): number => {
            if (rest === 0) {
                return 0;
            }
            const cached = memo.get(rest);
            if (cached !== undefined) {
                return cached;
            }
            let power = 1;
            let count = 0;
            while (power * x <= rest) {
                power *= x;
                count += 1;
            }
            const positive = count + solve(rest - power);
            const negative = power * x - rest < rest ? count + 1 + solve(power * x - rest) : Number.POSITIVE_INFINITY;
            const answer = Math.min(positive, negative);
            memo.set(rest, answer);
            return answer;
        };
        return solve(target);
    }
}
