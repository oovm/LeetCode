export class Solution {
    frequencySort(nums: number[]): number[] {
        const count = new Map<number, number>();
        for (const v of nums) count.set(v, (count.get(v) ?? 0) + 1);
        return [...nums].sort((a, b) => {
            const ca = count.get(a)!;
            const cb = count.get(b)!;
            return ca !== cb ? ca - cb : b - a;
        });
    }
}
