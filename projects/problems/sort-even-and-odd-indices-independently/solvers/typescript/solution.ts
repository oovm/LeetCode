export class Solution {
    sortEvenOdd(nums: number[]): number[] {
        const evens = nums.filter((_, i) => i % 2 === 0).sort((a, b) => a - b);
        const odds = nums.filter((_, i) => i % 2 === 1).sort((a, b) => b - a);
        const out = new Array(nums.length);
        let e = 0;
        let o = 0;
        for (let i = 0; i < nums.length; i++) {
            out[i] = i % 2 === 0 ? evens[e++] : odds[o++];
        }
        return out;
    }
}
