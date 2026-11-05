export class Solution {
    optimalDivision(nums: number[]): string {
        if (nums.length === 1) {
            return String(nums[0]);
        }
        if (nums.length === 2) {
            return `${nums[0]}/${nums[1]}`;
        }
        return `${nums[0]}/(${nums.slice(1).join("/")})`;
    }
}
