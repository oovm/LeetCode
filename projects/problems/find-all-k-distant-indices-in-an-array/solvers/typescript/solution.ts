export class Solution {
    findKDistantIndices(nums: number[], key: number, k: number): number[] {
        const out: number[] = [];
        let lo = 0;
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] === key) {
                lo = Math.max(lo, i - k);
                const hi = Math.min(nums.length - 1, i + k);
                while (lo <= hi) {
                    out.push(lo);
                    lo++;
                }
            }
        }
        return out;
    }
}
