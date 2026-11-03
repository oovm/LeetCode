export class Solution {
    countQuadruplets(nums: number[]): number {
        const n = nums.length;
        let count = 0;
        for (let d = 3; d < n; d++) {
            for (let c = 2; c < d; c++) {
                for (let b = 1; b < c; b++) {
                    for (let a = 0; a < b; a++) {
                        if (nums[a] + nums[b] + nums[c] === nums[d]) count++;
                    }
                }
            }
        }
        return count;
    }
}
