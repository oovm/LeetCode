export class Solution {
    smallestNumber(num: number): number {
        const digits = String(Math.abs(num)).split('').map(Number);
        if (num < 0) {
            digits.sort((a, b) => b - a);
            return -Number(digits.join(''));
        }
        digits.sort((a, b) => a - b);
        const first = digits.findIndex((d) => d !== 0);
        if (first > 0) {
            [digits[0], digits[first]] = [digits[first] as number, 0];
        }
        return Number(digits.join(''));
    }
}
