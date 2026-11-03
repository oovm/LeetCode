export class Solution {
    topKFrequent(nums: number[], k: number): number[] {
        const count = new Map<number, number>();
        for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
        return [...count.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, k)
            .map(([x]) => x);
    }
}
