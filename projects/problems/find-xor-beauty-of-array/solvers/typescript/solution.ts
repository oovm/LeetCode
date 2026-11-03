export class Solution {
    xorBeauty(nums: number[]): number {
        let result = 0;
        for (const x of nums) result ^= x;
        return result;
    }
}
