export class Solution {
    partitionDisjoint(nums: number[]): number {
        const n = nums.length;
        const suffix = new Array<number>(n);
        suffix[n - 1] = nums[n - 1];
        for (let i = n - 2; i >= 0; i--) {
            suffix[i] = Math.min(nums[i], suffix[i + 1]);
        }
        let leftMax = nums[0];
        for (let split = 0; split < n - 1; split++) {
            if (leftMax <= suffix[split + 1]) {
                return split + 1;
            }
            leftMax = Math.max(leftMax, nums[split + 1]);
        }
        return n;
    }
}
