export class Solution {
    maxNonOverlapping(nums: number[], target: number): number {
        let seen = new Set<number>([0]);
        let prefix = 0;
        let total = 0;
        for (const value of nums) {
            prefix += value;
            if (seen.has(prefix - target)) {
                total++;
                seen = new Set<number>([0]);
                prefix = 0;
            } else {
                seen.add(prefix);
            }
        }
        return total;
    }
}
