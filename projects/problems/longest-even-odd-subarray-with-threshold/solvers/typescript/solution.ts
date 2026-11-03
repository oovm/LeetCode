export class Solution {
    longestAlternatingSubarray(nums: number[], threshold: number): number {
        let best = 0;
        let i = 0;
        while (i < nums.length) {
            if (nums[i] % 2 === 0 && nums[i] <= threshold) {
                let j = i;
                while (
                    j + 1 < nums.length &&
                    nums[j + 1] <= threshold &&
                    nums[j] % 2 !== nums[j + 1] % 2
                ) {
                    j++;
                }
                best = Math.max(best, j - i + 1);
                i = j + 1;
            } else {
                i++;
            }
        }
        return best;
    }
}
