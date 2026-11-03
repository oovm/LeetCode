export class Solution {
    minBitwiseArray(nums: number[]): number[] {
        return nums.map((target) => {
            for (let x = 0; x < target; x++) {
                if ((x | (x + 1)) === target) return x;
            }
            return -1;
        });
    }
}
