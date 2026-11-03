export class Solution {
    maxProduct(nums: number[]): number {
        let first = 0;
        let second = 0;
        for (const v of nums) {
            if (v > first) {
                second = first;
                first = v;
            } else if (v > second) {
                second = v;
            }
        }
        return (first - 1) * (second - 1);
    }
}
