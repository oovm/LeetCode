export class Solution {
    numSubarrayBoundedMax(nums: number[], left: number, right: number): number {
        const countAtMost = (bound: number): number => {
            let result = 0;
            let run = 0;
            for (const value of nums) {
                run = value <= bound ? run + 1 : 0;
                result += run;
            }
            return result;
        };
        return countAtMost(right) - countAtMost(left - 1);
    }
}
