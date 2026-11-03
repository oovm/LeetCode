export class Solution {
    arrayPairSum(nums: number[]): number {
        const sorted = [...nums].sort((a, b) => a - b);
        let sum = 0;
        for (let i = 0; i < sorted.length; i += 2) {
            sum += sorted[i];
        }
        return sum;
    }
}
