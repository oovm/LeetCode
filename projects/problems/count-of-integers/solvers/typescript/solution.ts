export class Solution {
    count(num2: string, num1: string, min_sum: number, max_sum: number): number {
        const MOD = 1000000007;
        const sumDigits = (x: string): number => [...x].reduce((a, c) => a + c.charCodeAt(0) - 48, 0);
        const upto = (bound: string): number => {
            const digits = [...bound].map((c) => c.charCodeAt(0) - 48);
            const memo = new Map<string, number>();
            const dfs = (pos: number, sum: number, tight: boolean): number => {
                if (sum > max_sum) return 0;
                if (pos === digits.length) return sum >= min_sum ? 1 : 0;
                const key = `${pos},${sum}`;
                if (!tight) {
                    const hit = memo.get(key);
                    if (hit !== undefined) return hit;
                }
                const limit = tight ? digits[pos] : 9;
                let total = 0;
                for (let d = 0; d <= limit; d++) {
                    total = (total + dfs(pos + 1, sum + d, tight && d === limit)) % MOD;
                }
                if (!tight) memo.set(key, total);
                return total;
            };
            return dfs(0, 0, true);
        };
        const sum1 = sumDigits(num1);
        const inclusive = sum1 >= min_sum && sum1 <= max_sum ? 1 : 0;
        return (((upto(num2) - upto(num1)) % MOD) + MOD + inclusive) % MOD;
    }
}
