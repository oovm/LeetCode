export class Solution {
    tupleSameProduct(nums: number[]): number {
        const products = new Map<number, number>();
        let total = 0;
        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                const product = nums[i] * nums[j];
                const existing = products.get(product) ?? 0;
                total += existing * 8;
                products.set(product, existing + 1);
            }
        }
        return total;
    }
}
