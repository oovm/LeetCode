export class Solution {
    minSubsequence(nums: number[]): number[] {
        const sorted = [...nums].sort((a, b) => b - a);
        const total = sorted.reduce((a, b) => a + b, 0);
        const out: number[] = [];
        let sum = 0;
        for (const v of sorted) {
            out.push(v);
            sum += v;
            if (sum > total - sum) break;
        }
        return out;
    }
}
