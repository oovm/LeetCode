export class Solution {
    minOperations(nums: number[], k: number): number {
        const needed = new Set(Array.from({ length: k }, (_, i) => i + 1));
        let ops = 0;
        for (let i = nums.length - 1; i >= 0 && needed.size > 0; i--) {
            needed.delete(nums[i]);
            ops++;
        }
        return ops;
    }
}
