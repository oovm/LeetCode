export class Solution {
    increasingTriplet(nums: number[]): boolean {
        let first = Infinity;
        let second = Infinity;
        for (const x of nums) {
            if (x <= first) first = x;
            else if (x <= second) second = x;
            else return true;
        }
        return false;
    }
}
