export class Solution {
    xorAllNums(nums1: number[], nums2: number[]): number {
        let xor1 = 0;
        for (const x of nums1) xor1 ^= x;
        let xor2 = 0;
        for (const y of nums2) xor2 ^= y;
        let result = 0;
        if (nums2.length % 2 === 1) result ^= xor1;
        if (nums1.length % 2 === 1) result ^= xor2;
        return result;
    }
}
