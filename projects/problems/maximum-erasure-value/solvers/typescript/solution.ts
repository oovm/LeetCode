export class Solution {
    maximumUniqueSubarray(nums: number[]): number {
        const n = nums.length;
        const prefix = new Array<number>(n + 1).fill(0);
        for (let i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        const lastPosition = new Map<number, number>();
        let left = 0;
        let best = 0;
        for (let i = 0; i < n; i++) {
            const value = nums[i];
            const previous = lastPosition.get(value);
            if (previous !== undefined) {
                left = Math.max(left, previous + 1);
            }
            lastPosition.set(value, i);
            best = Math.max(best, prefix[i + 1] - prefix[left]);
        }
        return best;
    }
}
