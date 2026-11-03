export class Solution {
    minimumOperations(nums: number[]): number {
        for (let ops = 0; ops * 3 <= nums.length; ops++) {
            const rest = nums.slice(ops * 3);
            if (new Set(rest).size === rest.length) return ops;
        }
        return Math.ceil(nums.length / 3);
    }
}
