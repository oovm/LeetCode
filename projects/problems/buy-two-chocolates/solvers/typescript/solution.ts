export class Solution {
    buyChoco(prices: number[], money: number): number {
        prices.sort((a, b) => a - b);
        const cost = prices[0] + prices[1];
        return cost <= money ? money - cost : money;
    }
}
