export class Solution {
    decompressRLElist(nums: number[]): number[] {
        const out: number[] = [];
        for (let i = 0; i < nums.length; i += 2) {
            for (let j = 0; j < nums[i]; j++) out.push(nums[i + 1]);
        }
        return out;
    }
}
