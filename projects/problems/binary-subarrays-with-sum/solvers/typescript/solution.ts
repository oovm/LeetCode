export class Solution {
    numSubarraysWithSum(nums: number[], goal: number): number {
        const counts = new Map<number, number>();
        counts.set(0, 1);

        let prefix = 0;
        let total = 0;
        for (const value of nums) {
            prefix += value;
            total += counts.get(prefix - goal) ?? 0;
            counts.set(prefix, (counts.get(prefix) ?? 0) + 1);
        }
        return total;
    }
}
