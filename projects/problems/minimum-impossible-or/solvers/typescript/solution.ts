export class Solution {
    minImpossibleOR(nums: number[]): number {
        const present = new Set<number>(nums);
        for (let bit = 0; bit < 32; bit++) {
            const value = 2 ** bit;
            if (!present.has(value)) return value;
        }
        return 2 ** 32;
    }
}
