export class Solution {
    getSneakyNumbers(nums: number[]): number[] {
        const seen = new Set<number>();
        const result: number[] = [];
        for (const x of nums) {
            if (seen.has(x)) result.push(x);
            seen.add(x);
        }
        return result;
    }
}
