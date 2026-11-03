export class Solution {
    minimumSubstringsInPartition(s: string): number {
        const n = s.length;
        const dp = new Array<number>(n + 1).fill(Infinity);
        dp[0] = 0;
        for (let i = 0; i < n; i++) {
            const counts = new Array<number>(26).fill(0);
            for (let j = i; j < n; j++) {
                counts[s.charCodeAt(j) - 97] += 1;
                const present = counts.filter((c) => c > 0);
                if (present.every((c) => c === present[0])) {
                    dp[j + 1] = Math.min(dp[j + 1], dp[i] + 1);
                }
            }
        }
        return dp[n];
    }
}
