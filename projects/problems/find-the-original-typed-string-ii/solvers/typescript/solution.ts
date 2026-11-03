export class Solution {
    possibleStringCount(k: number, word: string): number {
        const MOD = 1000000007;
        const runs: number[] = [];
        let i = 0;
        while (i < word.length) {
            let j = i;
            while (j < word.length && word[j] === word[i]) j += 1;
            runs.push(j - i);
            i = j;
        }
        let total = 1;
        for (const len of runs) {
            total = (total * len) % MOD;
        }
        if (runs.length >= k) return total;
        const rest = k - runs.length - 1;
        let dp = new Array<number>(rest + 1).fill(0);
        dp[0] = 1;
        for (const len of runs) {
            const next = new Array<number>(rest + 1).fill(0);
            let window = 0;
            for (let s2 = 0; s2 <= rest; s2++) {
                window = (window + dp[s2]) % MOD;
                if (s2 - len >= 0) window = (window - dp[s2 - len] + MOD) % MOD;
                next[s2] = window;
            }
            dp = next;
        }
        return (total - dp.reduce((a, b) => (a + b) % MOD, 0) + MOD) % MOD;
    }
}
