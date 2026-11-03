export class Solution {
    mostFrequentEven(nums: number[]): number {
        const count = new Map<number, number>();
        for (const x of nums) {
            if (x % 2 === 0) count.set(x, (count.get(x) ?? 0) + 1);
        }
        let best = -1;
        let bestCount = 0;
        for (const [x, c] of count) {
            if (c > bestCount || (c === bestCount && x < best)) {
                best = x;
                bestCount = c;
            }
        }
        return best;
    }
}
