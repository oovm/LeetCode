export class Solution {
    countSteppingNumbers(low: string, high: string): number {
        const MOD = 1000000007;
        const upto = (bound: string): number => {
            const digits = [...bound].map((c) => c.charCodeAt(0) - 48);
            const memo = new Map<string, number>();
            const dfs = (pos: number, prev: number, tight: boolean, started: boolean): number => {
                if (pos === digits.length) return started ? 1 : 0;
                const key = `${pos},${prev},${started}`;
                if (!tight) {
                    const hit = memo.get(key);
                    if (hit !== undefined) return hit;
                }
                const limit = tight ? digits[pos] : 9;
                let total = 0;
                for (let d = 0; d <= limit; d++) {
                    if (!started && d === 0) {
                        total = (total + dfs(pos + 1, prev, tight && d === limit, false)) % MOD;
                    } else if (!started || Math.abs(d - prev) === 1) {
                        total = (total + dfs(pos + 1, d, tight && d === limit, true)) % MOD;
                    }
                }
                if (!tight) memo.set(key, total);
                return total;
            };
            return dfs(0, 0, true, false);
        };
        const lowValid = [...low].every((c, i, arr) => i === 0 || Math.abs(c.charCodeAt(0) - arr[i - 1].charCodeAt(0)) === 1);
        return (((upto(high) - upto(low)) % MOD) + MOD + (lowValid ? 1 : 0)) % MOD;
    }
}
