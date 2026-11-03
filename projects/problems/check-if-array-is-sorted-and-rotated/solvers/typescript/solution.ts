export class Solution {
    check(nums: number[]): boolean {
        const n = nums.length;
        let drops = 0;
        for (let i = 0; i < n; i++) {
            if (nums[i] > nums[(i + 1) % n]) drops++;
        }
        return drops <= 1;
    }
}
