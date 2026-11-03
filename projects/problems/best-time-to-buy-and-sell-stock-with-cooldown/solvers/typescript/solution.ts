export class Solution {
    maxProfit(prices: number[]): number {
        let hold = -Infinity;
        let sold = 0;
        let rest = 0;
        for (const p of prices) {
            [hold, sold, rest] = [Math.max(hold, rest - p), hold + p, Math.max(rest, sold)];
        }
        return Math.max(sold, rest);
    }
}
