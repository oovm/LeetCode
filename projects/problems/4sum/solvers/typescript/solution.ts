export class Solution {
    fourSum(nums: number[], target: number): number[][] {
        nums.sort((a, b) => a - b);
        const result: number[][] = [];
        const n = nums.length;
        for (let a = 0; a + 3 < n; a++) {
            if (a > 0 && nums[a] === nums[a - 1]) continue;
            for (let b = a + 1; b + 2 < n; b++) {
                if (b > a + 1 && nums[b] === nums[b - 1]) continue;
                let lo = b + 1;
                let hi = n - 1;
                while (lo < hi) {
                    const sum = nums[a] + nums[b] + nums[lo] + nums[hi];
                    if (sum < target) lo++;
                    else if (sum > target) hi--;
                    else {
                        result.push([nums[a], nums[b], nums[lo], nums[hi]]);
                        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
                        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
                        lo++;
                        hi--;
                    }
                }
            }
        }
        return result;
    }
}
