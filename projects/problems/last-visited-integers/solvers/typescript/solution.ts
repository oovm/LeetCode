export class Solution {
    lastVisitedIntegers(nums: number[]): number[] {
        const seen: number[] = [];
        const result: number[] = [];
        let consecutivePrev = 0;
        for (const x of nums) {
            if (x > 0) {
                seen.unshift(x);
                consecutivePrev = 0;
            } else {
                consecutivePrev++;
                result.push(consecutivePrev <= seen.length ? seen[consecutivePrev - 1] : -1);
            }
        }
        return result;
    }
}
