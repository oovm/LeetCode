export class Solution {
    semiOrderedPermutation(nums: number[]): number {
        const n = nums.length;
        const i1 = nums.indexOf(1);
        const in_ = nums.indexOf(n);
        return i1 + (n - 1 - in_) - (i1 > in_ ? 1 : 0);
    }
}
