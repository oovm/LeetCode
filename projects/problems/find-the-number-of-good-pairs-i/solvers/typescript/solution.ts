export class Solution {
    numberOfPairs(nums1: number[], nums2: number[], k: number): number {
        let count = 0;
        for (const a of nums1) {
            for (const b of nums2) {
                if (a % (b * k) === 0) count++;
            }
        }
        return count;
    }
}
