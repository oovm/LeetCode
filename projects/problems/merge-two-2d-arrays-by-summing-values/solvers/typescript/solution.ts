export class Solution {
    mergeArrays(nums1: number[][], nums2: number[][]): number[][] {
        const value = new Map<number, number>();
        for (const [id, v] of [...nums1, ...nums2]) {
            value.set(id, (value.get(id) ?? 0) + v);
        }
        return [...value.entries()].sort((a, b) => a[0] - b[0]);
    }
}
