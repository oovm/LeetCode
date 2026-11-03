export class Solution {
    maxFrequencyElements(nums: number[]): number {
        const count = new Map<number, number>();
        for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
        const best = Math.max(...count.values());
        let total = 0;
        for (const c of count.values()) if (c === best) total += c;
        return total;
    }
}
