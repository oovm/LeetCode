export class Solution {
    getSumAbsoluteDifferences(nums: number[]): number[] {
        const total = nums.reduce((sum, value) => sum + value, 0);
        const result: number[] = [];
        let prefix = 0;
        for (let i = 0; i < nums.length; i++) {
            const value = nums[i];
            const left = value * i - prefix;
            const right = total - prefix - value - value * (nums.length - i - 1);
            result.push(left + right);
            prefix += value;
        }
        return result;
    }
}
