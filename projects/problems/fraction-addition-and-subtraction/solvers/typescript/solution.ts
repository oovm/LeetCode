export class Solution {
    fractionAddition(expression: string): string {
        let numerator = 0;
        let denominator = 1;
        for (const match of expression.matchAll(/[+-]?\d+\/\d+/g)) {
            const [a, b] = match[0].split('/').map(Number);
            numerator = numerator * b + a * denominator;
            denominator *= b;
            const g = gcd(Math.abs(numerator), denominator);
            numerator /= g;
            denominator /= g;
        }
        function gcd(a: number, b: number): number {
            return b === 0 ? a : gcd(b, a % b);
        }
        return `${numerator}/${denominator}`;
    }
}
