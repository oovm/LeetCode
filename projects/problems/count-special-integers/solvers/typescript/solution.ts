export class Solution {
    countSpecialNumbers(n: number): number {
        const digits = String(n)
            .split('')
            .map((d) => d.charCodeAt(0) - 48);
        const perm = (a: number, b: number): number => {
            let result = 1;
            for (let i = 0; i < b; i++) {
                result *= a - i;
            }
            return result;
        };
        let total = 0;
        for (let length = 1; length < digits.length; length++) {
            total += 9 * perm(9, length - 1);
        }
        let used = 0;
        for (let i = 0; i < digits.length; i++) {
            const bound = digits[i];
            for (let d = i === 0 ? 1 : 0; d < bound; d++) {
                if (((used >> d) & 1) === 0) {
                    total += perm(10 - i - 1, digits.length - i - 1);
                }
            }
            if (((used >> bound) & 1) === 1) {
                return total;
            }
            used += 1 << bound;
        }
        return total + 1;
    }
}
