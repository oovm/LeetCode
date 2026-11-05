export class Solution {
    sumEvenAfterQueries(nums: number[], queries: number[][]): number[] {
        let total = 0;
        for (const value of nums) {
            if (value % 2 === 0) {
                total += value;
            }
        }
        const result: number[] = [];
        for (const [value, at] of queries) {
            const old = nums[at];
            if (old % 2 === 0) {
                total -= old;
            }
            const updated = old + value;
            nums[at] = updated;
            if (updated % 2 === 0) {
                total += updated;
            }
            result.push(total);
        }
        return result;
    }
}
