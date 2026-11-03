export class Solution {
    plusOne(head: number[]): number[] {
        const digits = [...head];
        let carry = 1;
        for (let i = digits.length - 1; i >= 0 && carry; i--) {
            const sum = digits[i] + carry;
            digits[i] = sum % 10;
            carry = Math.floor(sum / 10);
        }
        return carry ? [1, ...digits] : digits;
    }
}
