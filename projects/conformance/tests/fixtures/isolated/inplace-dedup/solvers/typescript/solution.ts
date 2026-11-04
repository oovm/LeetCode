export class Solution {
    dedup(nums: number[]): number {
        let k = 0;
        for (const value of nums.slice()) {
            if (k === 0 || value !== nums[k - 1]) {
                nums[k] = value;
                k += 1;
            }
        }
        return k;
    }
}
