export class Solution {
    kLengthApart(nums: number[], k: number): boolean {
        let prev = -k - 1;
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] === 1) {
                if (i - prev - 1 < k) return false;
                prev = i;
            }
        }
        return true;
    }
}
