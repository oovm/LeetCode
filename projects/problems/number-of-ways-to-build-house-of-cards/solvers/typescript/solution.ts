export class Solution {
    houseOfCards(n: number): number {
        // 行含 t 个三角用 3t-1 张牌；高层三角数严格递减 ⟺ 互不相同的 3t-1 面值子集。
        const dp = new Array<number>(n + 1).fill(0);
        dp[0] = 1;
        for (let t = 1; 3 * t - 1 <= n; t++) {
            const cost = 3 * t - 1;
            for (let sum = n; sum >= cost; sum--) {
                dp[sum] = (dp[sum] as number) + (dp[sum - cost] as number);
            }
        }
        return dp[n] as number;
    }
}
