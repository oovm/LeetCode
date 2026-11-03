export class Solution {
    canJump(nums: number[]): boolean {
        let farthest = 0;
        for (let i = 0; i < nums.length && i <= farthest; i++) {
            farthest = Math.max(farthest, i + nums[i]);
        }
        return farthest >= nums.length - 1;
    }
}
