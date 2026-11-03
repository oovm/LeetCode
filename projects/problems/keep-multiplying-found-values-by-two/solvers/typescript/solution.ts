export class Solution {
    findFinalValue(nums: number[], original: number): number {
        const seen = new Set(nums);
        let v = original;
        while (seen.has(v)) v *= 2;
        return v;
    }
}
