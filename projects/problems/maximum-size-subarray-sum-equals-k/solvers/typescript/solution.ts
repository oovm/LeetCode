export class Solution {
    maxSubArrayLen(nums: number[], k: number): number {
        const firstSeen = new Map<number, number>([[0, -1]]);
        let sum = 0;
        let best = 0;
        for (let i = 0; i < nums.length; i++) {
            sum += nums[i];
            if (firstSeen.has(sum - k)) best = Math.max(best, i - firstSeen.get(sum - k)!);
            if (!firstSeen.has(sum)) firstSeen.set(sum, i);
        }
        return best;
    }
}
