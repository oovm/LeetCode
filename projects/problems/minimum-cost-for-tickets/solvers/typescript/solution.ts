export class Solution {
    mincostTickets(days: number[], costs: number[]): number {
        const dp = new Array<number>(days.length + 1).fill(0);
        let first7 = 0;
        let first30 = 0;
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            while (day - days[first7] >= 7) {
                first7++;
            }
            while (day - days[first30] >= 30) {
                first30++;
            }
            dp[i + 1] = Math.min(dp[i] + costs[0], dp[first7] + costs[1], dp[first30] + costs[2]);
        }
        return dp[days.length];
    }
}
