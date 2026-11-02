export class Solution {
    minStartValue(nums: number[]): number {
        let sum = 0;
        let lowest = 0;
        for (const v of nums) {
            sum += v;
            if (sum < lowest) {
                lowest = sum;
            }
        }
        return 1 - lowest;
    }
}
