export class Solution {
    finalPrices(prices: number[]): number[] {
        const n = prices.length;
        const out = [...prices];
        const stack: number[] = [];
        for (let i = 0; i < n; i++) {
            while (stack.length > 0 && prices[stack[stack.length - 1]] >= prices[i]) {
                out[stack.pop()!] -= prices[i];
            }
            stack.push(i);
        }
        return out;
    }
}
