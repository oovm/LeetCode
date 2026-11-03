export class Solution {
    countWinningSequences(s: string): number {
        const MOD = 1000000007;
        const n = s.length;
        const beats = (a: number, b: number): number => ((a - b + 3) % 3 === 1 ? 1 : a === b ? 0 : -1);
        const val = (ch: string): number => (ch === 'F' ? 0 : ch === 'W' ? 1 : 2);
        const memo = new Map<string, number>();
        const dfs = (i: number, prev: number, score: number): number => {
            if (i === n) return score > 0 ? 1 : 0;
            const key = `${i},${prev},${score}`;
            const hit = memo.get(key);
            if (hit !== undefined) return hit;
            let total = 0;
            for (let move = 0; move < 3; move++) {
                if (move === prev) continue;
                total = (total + dfs(i + 1, move, score + beats(move, val(s[i])))) % MOD;
            }
            memo.set(key, total);
            return total;
        };
        return dfs(0, -1, 0);
    }
}
