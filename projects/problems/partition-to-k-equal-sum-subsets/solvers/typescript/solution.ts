export class Solution {
    canPartitionKSubsets(nums: number[], k: number): boolean {
        const total = nums.reduce((sum, value) => sum + value, 0);
        if (k <= 0 || total % k !== 0) {
            return false;
        }
        const target = total / k;
        const used: boolean[] = new Array(nums.length).fill(false);

        const fill = (start: number, current: number, groupsLeft: number): boolean => {
            if (current === target) {
                if (groupsLeft === 1) {
                    return true;
                }
                return fill(0, 0, groupsLeft - 1);
            }
            for (let index = start; index < nums.length; index++) {
                if (used[index]) {
                    continue;
                }
                if (current + nums[index] <= target) {
                    used[index] = true;
                    if (fill(index + 1, current + nums[index], groupsLeft)) {
                        return true;
                    }
                    used[index] = false;
                }
            }
            return false;
        };

        return fill(0, 0, k);
    }
}
