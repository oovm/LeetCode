export class Solution {
    rotate(nums: number[], k: number): void {
        const n = nums.length;
        k %= n;
        const flip = (lo: number, hi: number) => {
            for (; lo < hi; lo++, hi--) [nums[lo], nums[hi]] = [nums[hi], nums[lo]];
        };
        flip(0, n - 1);
        flip(0, k - 1);
        flip(k, n - 1);
    }
}
