export class Solution {
    findMaximumXOR(nums: number[]): number {
        let best = 0;
        let mask = 0;
        for (let bit = 30; bit >= 0; bit--) {
            mask |= 1 << bit;
            const prefixes = new Set(nums.map((x) => x & mask));
            const candidate = best | (1 << bit);
            for (const p of prefixes) {
                if (prefixes.has(candidate ^ p)) {
                    best = candidate;
                    break;
                }
            }
        }
        return best;
    }
}
