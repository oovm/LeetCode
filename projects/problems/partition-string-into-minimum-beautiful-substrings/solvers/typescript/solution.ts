export class Solution {
    minimumBeautifulSubstrings(s: string): number {
        const beautiful = new Set<string>();
        for (let p = 1; p < 1 << 16; p *= 5) {
            beautiful.add(p.toString(2));
        }
        const n = s.length;
        const dp = new Array<number>(n + 1).fill(Infinity);
        dp[0] = 0;
        for (let i = 0; i < n; i++) {
            if (s[i] === '0') continue;
            for (let j = i + 1; j <= n; j++) {
                if (beautiful.has(s.slice(i, j))) {
                    dp[j] = Math.min(dp[j], dp[i] + 1);
                }
            }
        }
        return dp[n] === Infinity ? -1 : dp[n];
    }
}
