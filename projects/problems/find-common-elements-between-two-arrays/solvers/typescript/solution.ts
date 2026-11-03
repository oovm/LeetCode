export class Solution {
    findIntersectionValues(nums1: number[], nums2: number[]): number[] {
        const set1 = new Set(nums1);
        const set2 = new Set(nums2);
        return [
            nums1.filter((x) => set2.has(x)).length,
            nums2.filter((x) => set1.has(x)).length,
        ];
    }
}
