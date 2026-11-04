export class Solution {
    subarraysDivByK(nums: number[], k: number): number {
        const counts = new Map<number, number>();
        counts.set(0, 1);
        let prefix = 0;
        let total = 0;
        for (const value of nums) {
            prefix += value;
            const remainder = ((prefix % k) + k) % k;
            total += counts.get(remainder) ?? 0;
            counts.set(remainder, (counts.get(remainder) ?? 0) + 1);
        }
        return total;
    }
}
