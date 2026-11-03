export class Solution {
    threeSumSmaller(nums: number[], target: number): number {
        nums.sort((a, b) => a - b);
        let count = 0;
        for (let i = 0; i + 2 < nums.length; i++) {
            let lo = i + 1;
            let hi = nums.length - 1;
            while (lo < hi) {
                if (nums[i] + nums[lo] + nums[hi] < target) {
                    count += hi - lo;
                    lo++;
                } else hi--;
            }
        }
        return count;
    }
}
