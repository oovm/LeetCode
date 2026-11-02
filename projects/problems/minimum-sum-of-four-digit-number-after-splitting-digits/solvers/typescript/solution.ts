export class Solution {
    minimumSum(num: number): number {
        const digits: number[] = [];
        while (num > 0) {
            digits.push(num % 10);
            num = Math.floor(num / 10);
        }
        digits.sort((a, b) => a - b);
        return 10 * (digits[0] + digits[1]) + digits[2] + digits[3];
    }
}
