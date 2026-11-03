export class Solution {
    differenceOfSum(nums: number[]): number {
        let elementSum = 0;
        let digitSum = 0;
        for (const x of nums) {
            elementSum += x;
            for (let v = x; v > 0; v = Math.floor(v / 10)) digitSum += v % 10;
        }
        return Math.abs(elementSum - digitSum);
    }
}
