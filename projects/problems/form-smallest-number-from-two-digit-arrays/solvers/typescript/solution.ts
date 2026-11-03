export class Solution {
    minNumber(nums1: number[], nums2: number[]): number {
        const set2 = new Set(nums2);
        const common = nums1.filter((x) => set2.has(x));
        if (common.length > 0) return Math.min(...common);
        const a = Math.min(...nums1);
        const b = Math.min(...nums2);
        return Math.min(10 * a + b, 10 * b + a);
    }
}
