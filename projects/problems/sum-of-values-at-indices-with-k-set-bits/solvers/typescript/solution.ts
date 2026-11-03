export class Solution {
    sumIndicesWithKSetBits(nums: number[], k: number): number {
        const popcount = (x: number) => {
            let c = 0;
            for (; x > 0; x >>= 1) c += x & 1;
            return c;
        };
        let sum = 0;
        for (let i = 0; i < nums.length; i++) {
            if (popcount(i) === k) sum += nums[i];
        }
        return sum;
    }
}
