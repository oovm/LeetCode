export class Solution {
    maximumWealth(accounts: number[][]): number {
        let best = 0;
        for (const account of accounts) {
            best = Math.max(best, account.reduce((a, b) => a + b, 0));
        }
        return best;
    }
}
