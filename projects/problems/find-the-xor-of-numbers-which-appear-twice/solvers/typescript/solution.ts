export class Solution {
    duplicateNumbersXOR(nums: number[]): number {
        const count = new Map<number, number>();
        for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
        let result = 0;
        for (const [x, c] of count) if (c === 2) result ^= x;
        return result;
    }
}
