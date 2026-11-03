export class Solution {
    separateDigits(nums: number[]): number[] {
        const result: number[] = [];
        for (const x of nums) {
            for (const ch of String(x)) result.push(Number(ch));
        }
        return result;
    }
}
