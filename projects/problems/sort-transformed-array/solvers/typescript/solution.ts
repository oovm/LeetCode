export class Solution {
    sortTransformedArray(nums: number[], a: number, b: number, c: number): number[] {
        const f = (x: number) => a * x * x + b * x + c;
        const result: number[] = [];
        let lo = 0;
        let hi = nums.length - 1;
        while (lo <= hi) {
            if (a >= 0) {
                if (f(nums[lo]) > f(nums[hi])) result.unshift(f(nums[lo++]));
                else result.unshift(f(nums[hi--]));
            } else {
                if (f(nums[lo]) < f(nums[hi])) result.push(f(nums[lo++]));
                else result.push(f(nums[hi--]));
            }
        }
        return result;
    }
}
