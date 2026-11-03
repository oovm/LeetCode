export class Solution {
    leftRightDifference(nums: number[]): number[] {
        const total = nums.reduce((a, b) => a + b, 0);
        let left = 0;
        return nums.map((x) => {
            const right = total - left - x;
            const d = Math.abs(left - right);
            left += x;
            return d;
        });
    }
}
