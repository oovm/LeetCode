export class Solution {
    twoOutOfThree(nums1: number[], nums2: number[], nums3: number[]): number[] {
        const sets = [new Set(nums1), new Set(nums2), new Set(nums3)];
        const count = new Map<number, number>();
        for (const set of sets) {
            for (const v of set) count.set(v, (count.get(v) ?? 0) + 1);
        }
        return [...count.entries()].filter(([, c]) => c >= 2).map(([v]) => v);
    }
}
