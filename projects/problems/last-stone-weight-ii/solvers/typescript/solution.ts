export class Solution {
    lastStoneWeightII(stones: number[]): number {
        let total = 0;
        for (const s of stones) total += s;
        const target = Math.floor(total / 2);
        const dp = new Array<boolean>(target + 1).fill(false);
        dp[0] = true;
        for (const s of stones) {
            for (let w = target; w >= s; w--) if (dp[w - s]) dp[w] = true;
        }
        for (let b = target; b >= 1; b--) if (dp[b]) return total - 2 * b;
        return total;
    }
}
