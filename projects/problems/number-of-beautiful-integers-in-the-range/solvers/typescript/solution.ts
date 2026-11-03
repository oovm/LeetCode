export class Solution {
    numberOfBeautifulIntegers(low: number, high: number, k: number): number {
        const count = (bound: number): number => {
            if (bound <= 0) return 0;
            const digits = String(bound)
                .split('')
                .map((d) => d.charCodeAt(0) - 48);
            const memo = new Map<string, number>();
            const dfs = (pos: number, diff: number, rem: number, tight: boolean, started: boolean): number => {
                if (pos === digits.length) {
                    return started && diff === 0 && rem === 0 ? 1 : 0;
                }
                const key = `${pos},${diff},${rem},${started}`;
                if (!tight) {
                    const hit = memo.get(key);
                    if (hit !== undefined) return hit;
                }
                const limit = tight ? digits[pos] : 9;
                let total = 0;
                for (let d = 0; d <= limit; d++) {
                    const ns = started || d > 0;
                    const dd = !ns ? 0 : diff + (d % 2 === 0 ? 1 : -1);
                    total += dfs(pos + 1, dd, ns ? (rem * 10 + d) % k : 0, tight && d === limit, ns);
                }
                if (!tight) memo.set(key, total);
                return total;
            };
            return dfs(0, 0, 0, true, false);
        };
        return count(high) - count(low - 1);
    }
}
