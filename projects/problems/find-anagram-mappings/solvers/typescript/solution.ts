export class Solution {
    anagramMappings(nums1: number[], nums2: number[]): number[] {
        const pos = new Map<number, number>();
        nums2.forEach((v, i) => pos.set(v, i));
        return nums1.map((v) => pos.get(v)!);
    }
}
