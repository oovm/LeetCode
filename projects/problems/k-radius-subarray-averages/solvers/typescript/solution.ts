export class Solution {
    getAverages(nums: number[], k: number): number[] {
        const n = nums.length;
        const out: number[] = new Array(n).fill(-1);
        if (k === 0) return nums.slice();
        const prefix: number[] = new Array(n + 1).fill(0);
        for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
        const width = 2 * k + 1;
        for (let i = k; i + k < n; i++) {
            out[i] = Math.floor((prefix[i + k + 1] - prefix[i - k]) / width);
        }
        return out;
    }
}
