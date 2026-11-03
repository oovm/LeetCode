export class Solution {
    largestUniqueNumber(nums: number[]): number {
        const count = new Map<number, number>();
        for (const v of nums) count.set(v, (count.get(v) ?? 0) + 1);
        let best = -1;
        for (const [v, c] of count) {
            if (c === 1 && v > best) best = v;
        }
        return best;
    }
}
