export class Solution {
    maxProfit(prices: number[], fee: number): number {
        let cash = 0;
        let hold = -prices[0];
        for (let i = 1; i < prices.length; i++) {
            const price = prices[i];
            if (hold + price - fee > cash) {
                cash = hold + price - fee;
            }
            if (cash - price > hold) {
                hold = cash - price;
            }
        }
        return cash;
    }
}
