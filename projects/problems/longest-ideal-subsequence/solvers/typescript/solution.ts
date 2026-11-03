export class Solution {
    longestIdealString(s: string, k: number): number {
        const dp = new Array<number>(26).fill(0);
        let best = 0;
        for (const ch of s) {
            const c = ch.charCodeAt(0) - 97;
            let reach = 0;
            for (let p = Math.max(0, c - k); p <= Math.min(25, c + k); p++) {
                reach = Math.max(reach, dp[p]);
            }
            dp[c] = reach + 1;
            best = Math.max(best, dp[c]);
        }
        return best;
    }
}
