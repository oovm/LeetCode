export class Solution {
    numberOfSubarrays(nums: number[], k: number): number {
        const counts = new Map<number, number>();
        counts.set(0, 1);
        let odd = 0;
        let total = 0;
        for (const value of nums) {
            if (value % 2 !== 0) odd += 1;
            total += counts.get(odd - k) ?? 0;
            counts.set(odd, (counts.get(odd) ?? 0) + 1);
        }
        return total;
    }
}
