export class Solution {
    alternatingSubarray(nums: number[]): number {
        let best = -1;
        for (let i = 0; i + 1 < nums.length; i++) {
            if (nums[i + 1] - nums[i] !== 1) continue;
            let j = i + 1;
            while (j + 1 < nums.length && nums[j + 1] === nums[j - 1]) j++;
            best = Math.max(best, j - i + 1);
        }
        return best;
    }
}
