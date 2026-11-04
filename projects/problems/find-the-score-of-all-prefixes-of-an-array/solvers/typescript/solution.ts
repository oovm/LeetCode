export class Solution {
    findPrefixScore(nums: number[]): number[] {
        const result: number[] = [];
        let maximum = 0;
        let total = 0;
        for (const value of nums) {
            maximum = Math.max(maximum, value);
            total += maximum + value;
            result.push(total);
        }
        return result;
    }
}
