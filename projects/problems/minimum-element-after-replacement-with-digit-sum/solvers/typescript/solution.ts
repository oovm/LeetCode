export class Solution {
    minElement(nums: number[]): number {
        const digitSum = (x: number) => {
            let s = 0;
            for (; x > 0; x = Math.floor(x / 10)) s += x % 10;
            return s;
        };
        return Math.min(...nums.map(digitSum));
    }
}
