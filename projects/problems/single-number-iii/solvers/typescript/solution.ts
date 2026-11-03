export class Solution {
    singleNumber(nums: number[]): number[] {
        let both = 0;
        for (const x of nums) both ^= x;
        const bit = both & -both;
        let a = 0;
        let b = 0;
        for (const x of nums) {
            if (x & bit) a ^= x;
            else b ^= x;
        }
        return [a, b];
    }
}
