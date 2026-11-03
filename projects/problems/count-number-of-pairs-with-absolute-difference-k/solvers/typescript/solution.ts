export class Solution {
    countKDifference(nums: number[], k: number): number {
        const count = new Map<number, number>();
        let pairs = 0;
        for (const v of nums) {
            pairs += (count.get(v - k) ?? 0) + (count.get(v + k) ?? 0);
            count.set(v, (count.get(v) ?? 0) + 1);
        }
        return pairs;
    }
}
