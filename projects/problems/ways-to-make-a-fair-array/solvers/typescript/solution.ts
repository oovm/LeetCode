export class Solution {
    waysToMakeFair(nums: number[]): number {
        let evenTotal = 0;
        let oddTotal = 0;
        for (let i = 0; i < nums.length; i++) {
            if (i % 2 === 0) evenTotal += nums[i];
            else oddTotal += nums[i];
        }
        let evenBefore = 0;
        let oddBefore = 0;
        let ways = 0;
        for (let i = 0; i < nums.length; i++) {
            const value = nums[i];
            const removedEven = evenTotal - evenBefore;
            const removedOdd = oddTotal - oddBefore;
            let nextEven = evenBefore + removedOdd;
            if (i % 2 === 1) nextEven -= value;
            let nextOdd = oddBefore + removedEven;
            if (i % 2 === 0) nextOdd -= value;
            if (nextEven === nextOdd) ways += 1;
            if (i % 2 === 0) evenBefore += value;
            else oddBefore += value;
        }
        return ways;
    }
}
