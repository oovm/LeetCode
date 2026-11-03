export class Solution {
    sumOfUnique(nums: number[]): number {
        const count = new Map<number, number>();
        for (const v of nums) count.set(v, (count.get(v) ?? 0) + 1);
        let sum = 0;
        for (const [v, c] of count) {
            if (c === 1) sum += v;
        }
        return sum;
    }
}
