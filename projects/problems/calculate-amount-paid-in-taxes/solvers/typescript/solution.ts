export class Solution {
    calculateTax(brackets: number[][], income: number): number {
        let tax = 0;
        let prev = 0;
        for (const [upper, percent] of brackets) {
            if (income <= prev) break;
            tax += (Math.min(income, upper) - prev) * percent;
            prev = upper;
        }
        return tax / 100;
    }
}
