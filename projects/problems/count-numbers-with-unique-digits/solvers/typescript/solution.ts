export class Solution {
    countNumbersWithUniqueDigits(n: number): number {
        if (n === 0) return 1;
        let total = 10;
        let unique = 9;
        let available = 9;
        for (let i = 2; i <= n; i++) {
            unique *= available;
            total += unique;
            available--;
        }
        return total;
    }
}
