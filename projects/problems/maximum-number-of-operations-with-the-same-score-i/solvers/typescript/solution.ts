export class Solution {
    maxOperations(nums: number[]): number {
        const target = nums[0] + nums[1];
        let count = 1;
        for (let i = 2; i + 1 < nums.length; i += 2) {
            if (nums[i] + nums[i + 1] !== target) break;
            count++;
        }
        return count;
    }
}
