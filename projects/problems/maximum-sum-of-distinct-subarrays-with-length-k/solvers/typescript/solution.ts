export class Solution {
    maximumSubarraySum(nums: number[], k: number): number {
        if (k > nums.length) return 0;

        const counts = new Map<number, number>();
        let sum = 0;
        for (let i = 0; i < k; i += 1) {
            counts.set(nums[i], (counts.get(nums[i]) ?? 0) + 1);
            sum += nums[i];
        }

        let best = counts.size === k ? sum : 0;
        for (let right = k; right < nums.length; right += 1) {
            const incoming = nums[right];
            counts.set(incoming, (counts.get(incoming) ?? 0) + 1);
            sum += incoming;

            const outgoing = nums[right - k];
            const rest = counts.get(outgoing)! - 1;
            if (rest === 0) counts.delete(outgoing);
            else counts.set(outgoing, rest);
            sum -= outgoing;

            if (counts.size === k) best = Math.max(best, sum);
        }
        return best;
    }
}
