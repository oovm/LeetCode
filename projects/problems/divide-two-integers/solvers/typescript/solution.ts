export class Solution {
    divide(dividend: number, divisor: number): number {
        const INT_MAX = 2147483647;
        const INT_MIN = -2147483648;
        if (dividend === INT_MIN && divisor === -1) return INT_MAX;
        const negative = (dividend < 0) !== (divisor < 0);
        let a = Math.abs(dividend);
        const b = Math.abs(divisor);
        let quotient = 0;
        while (a >= b) {
            let value = b;
            let count = 1;
            while (value * 2 <= a) {
                value *= 2;
                count *= 2;
            }
            quotient += count;
            a -= value;
        }
        return negative ? -quotient : quotient;
    }
}
