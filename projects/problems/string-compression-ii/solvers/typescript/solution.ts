export class Solution {
    getLengthOfOptimalCompression(s: string, k: number): number {
        const n = s.length;
        const memo = new Map<string, number>();
        const dfs = (i: number, prev: string, run: number, rest: number): number => {
            if (rest < 0) return Infinity;
            if (i === n) return 0;
            const key = `${i},${prev},${run},${rest}`;
            const hit = memo.get(key);
            if (hit !== undefined) return hit;
            const del = dfs(i + 1, prev, run, rest - 1);
            let keep: number;
            if (s[i] === prev) {
                const extra = run === 1 || run === 9 || run === 99 ? 1 : 0;
                keep = extra + dfs(i + 1, prev, run + 1, rest);
            } else {
                keep = 1 + dfs(i + 1, s[i], 1, rest);
            }
            const best = Math.min(del, keep);
            memo.set(key, best);
            return best;
        };
        return dfs(0, '', 0, k);
    }
}
