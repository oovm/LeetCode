export class Solution {
    smallestNumber(n: number): number {
        if (n < 10) {
            return n === 0 ? 0 : n;
        }
        let rest = n;
        const digits: number[] = [];
        for (let d = 9; d >= 2; d--) {
            while (rest % d === 0) {
                digits.push(d);
                rest /= d;
            }
        }
        if (rest > 1) {
            return 0;
        }
        digits.sort((a, b) => a - b);
        return Number(digits.join(''));
    }
}
