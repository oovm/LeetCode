export class Solution {
    minOperations(nums: number[], k: number): number {
        let total = 0;
        for (const value of nums) {
            total ^= value;
        }
        let diff = total ^ k;
        let count = 0;
        while (diff > 0) {
            count += diff & 1;
            diff >>= 1;
        }
        return count;
    }
}
