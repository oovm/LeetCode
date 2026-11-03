export class Solution {
    jump(nums: number[]): number {
        let jumps = 0;
        let end = 0;
        let farthest = 0;
        for (let i = 0; i + 1 < nums.length; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i === end) {
                jumps++;
                end = farthest;
            }
        }
        return jumps;
    }
}
