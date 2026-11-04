export class Solution {
    minimumCoins(prices: number[]): number {
        const count = prices.length;
        const dp = new Array<number>(count + 1).fill(0);
        const value = new Array<number>(count + 1).fill(0);
        const window: number[] = [];
        for (let index = 1; index <= count; index++) {
            value[index] = dp[index - 1] + prices[index - 1];
            while (window.length > 0 && value[window[window.length - 1]] >= value[index]) window.pop();
            window.push(index);
            const lower = Math.floor((index + 1) / 2);
            while (window[0] < lower) window.shift();
            dp[index] = value[window[0]];
        }
        return dp[count];
    }
}
