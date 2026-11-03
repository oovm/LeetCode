export class Solution {
    subsetXORSum(nums: number[]): number {
        let total = 0;
        const walk = (i: number, acc: number): void => {
            if (i === nums.length) {
                total += acc;
                return;
            }
            walk(i + 1, acc);
            walk(i + 1, acc ^ nums[i]);
        };
        walk(0, 0);
        return total;
    }
}
