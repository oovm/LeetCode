export class Solution {
    totalMoney(n: number): number {
        const weeks = Math.floor(n / 7);
        const days = n % 7;
        const fullWeeks = 7 * (weeks * (weeks - 1)) / 2 + 28 * weeks;
        const partial = days * weeks + (days * (days + 1)) / 2;
        return fullWeeks + partial;
    }
}
