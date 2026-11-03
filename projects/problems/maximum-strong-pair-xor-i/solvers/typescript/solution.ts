export class Solution {
    maximumStrongPairXor(nums: number[]): number {
        let best = 0;
        for (const x of nums) {
            for (const y of nums) {
                if (Math.abs(x - y) <= Math.min(x, y)) best = Math.max(best, x ^ y);
            }
        }
        return best;
    }
}
