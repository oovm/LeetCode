export class Solution {
    constructTransformedArray(nums: number[]): number[] {
        const n = nums.length;
        return nums.map((x, i) => nums[(((i + x) % n) + n) % n]);
    }
}
