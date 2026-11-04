export class Solution {
    maxSubarrayLength(nums: number[], k: number): number {
        const counts = new Map<number, number>();
        let left = 0;
        let best = 0;
        for (let right = 0; right < nums.length; right += 1) {
            const value = nums[right];
            counts.set(value, (counts.get(value) ?? 0) + 1);
            while (counts.get(value)! > k) {
                const oldest = nums[left];
                counts.set(oldest, counts.get(oldest)! - 1);
                left += 1;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
