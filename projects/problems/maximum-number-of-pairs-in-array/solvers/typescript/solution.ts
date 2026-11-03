export class Solution {
    numberOfPairs(nums: number[]): number[] {
        const count = new Map<number, number>();
        for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
        let pairs = 0;
        for (const c of count.values()) pairs += Math.floor(c / 2);
        return [pairs, nums.length - 2 * pairs];
    }
}
