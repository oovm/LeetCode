export class Solution {
    findMaxK(nums: number[]): number {
        const seen = new Set(nums);
        let best = -1;
        for (const x of nums) {
            if (x > best && seen.has(-x)) best = x;
        }
        return best;
    }
}
