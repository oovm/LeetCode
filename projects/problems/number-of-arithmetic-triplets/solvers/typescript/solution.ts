export class Solution {
    arithmeticTriplets(nums: number[], diff: number): number {
        const seen = new Set(nums);
        let count = 0;
        for (const x of nums) {
            if (seen.has(x + diff) && seen.has(x + 2 * diff)) count++;
        }
        return count;
    }
}
