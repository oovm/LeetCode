export class Solution {
    beautifulNumbers(l: number, r: number): number {
        const count = (bound: number): number => {
            if (bound < 1) return 0;
            const digits = String(bound)
                .split('')
                .map((d) => d.charCodeAt(0) - 48);
            const len = digits.length;
            let total = 0;
            for (let s = 1; s <= 9 * len; s++) {
                const memo = new Map<string, number>();
                const dfs = (pos: number, sum: number, prod: number, tight: boolean, started: boolean): number => {
                    if (sum > s) return 0;
                    if (pos === len) {
                        return started && sum === s && prod % s === 0 ? 1 : 0;
                    }
                    const key = `${pos},${sum},${prod},${started}`;
                    if (!tight) {
                        const hit = memo.get(key);
                        if (hit !== undefined) return hit;
                    }
                    const limit = tight ? digits[pos] : 9;
                    let ways = 0;
                    for (let d = 0; d <= limit; d++) {
                        const ns = started || d > 0;
                        ways += dfs(pos + 1, sum + d, ns ? (prod * d) % s : 1 % s, tight && d === limit, ns);
                    }
                    if (!tight) memo.set(key, ways);
                    return ways;
                };
                total += dfs(0, 0, 1 % s, true, false);
            }
            return total;
        };
        return count(r) - count(l - 1);
    }
}
