export class Solution {
    superEggDrop(k: number, n: number): number {
        const dp = new Array<number>(k + 1).fill(0);
        let moves = 0;
        while ((dp[k] as number) < n) {
            for (let eggs = k; eggs >= 1; eggs--) {
                dp[eggs] = (dp[eggs] as number) + (dp[eggs - 1] as number) + 1;
            }
            moves += 1;
        }
        return moves;
    }
}
