export class Solution {
    minIncrementForUnique(nums: number[]): number {
        const sorted = [...nums].sort((a, b) => a - b);
        let cost = 0;
        for (let index = 1; index < sorted.length; index++) {
            if (sorted[index] <= sorted[index - 1]) {
                const target = sorted[index - 1] + 1;
                cost += target - sorted[index];
                sorted[index] = target;
            }
        }
        return cost;
    }
}
