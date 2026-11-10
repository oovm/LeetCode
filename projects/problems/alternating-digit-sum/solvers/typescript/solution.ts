export class Solution {
    alternateDigitSum(n: number): number {
        const digits = String(n).split("").map(Number);
        let total = 0;
        for (let i = 0; i < digits.length; i++) {
            total += i % 2 === 0 ? digits[i] : -digits[i];
        }
        return total;
    }
}
