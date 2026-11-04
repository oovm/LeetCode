export class Solution {
    pivotArray(nums: number[], pivot: number): number[] {
        const less: number[] = [];
        const equal: number[] = [];
        const greater: number[] = [];
        for (const value of nums) {
            if (value < pivot) {
                less.push(value);
            } else if (value === pivot) {
                equal.push(value);
            } else {
                greater.push(value);
            }
        }
        return [...less, ...equal, ...greater];
    }
}
