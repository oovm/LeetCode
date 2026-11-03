export class Solution {
    findMissingRanges(nums: number[], lower: number, upper: number): number[][] {
        const out: number[][] = [];
        let prev = lower - 1;
        for (const v of [...nums, upper + 1]) {
            if (v - prev >= 2) {
                out.push([prev + 1, v - 1]);
            }
            prev = v;
        }
        return out;
    }
}
