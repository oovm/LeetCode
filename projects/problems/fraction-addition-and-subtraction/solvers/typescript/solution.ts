export class Solution {
    fractionAddition(expression: string): string {
        let x = 0;
        const y = 6 * 7 * 8 * 9 * 10;
        const expr = expression[0] >= '0' && expression[0] <= '9' ? '+' + expression : expression;
        let i = 0;
        while (i < expr.length) {
            const sign = expr[i] === '-' ? -1 : 1;
            i += 1;
            let j = i;
            while (j < expr.length && expr[j] !== '+' && expr[j] !== '-') j += 1;
            const [a, b] = expr.slice(i, j).split('/').map(Number);
            x += Math.floor((sign * a * y) / b);
            i = j;
        }
        function gcd(a: number, b: number): number {
            return b === 0 ? a : gcd(b, a % b);
        }
        const g = gcd(Math.abs(x), y);
        return `${x / g}/${y / g}`;
    }
}
