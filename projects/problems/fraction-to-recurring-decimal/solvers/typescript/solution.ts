export class Solution {
    fractionToDecimal(numerator: number, denominator: number): string {
        if (numerator === 0) {
            return '0';
        }
        const out: string[] = [];
        if (numerator < 0 !== denominator < 0) {
            out.push('-');
        }
        let rest = Math.abs(numerator);
        const divisor = Math.abs(denominator);
        out.push(String(Math.floor(rest / divisor)));
        rest %= divisor;
        if (rest === 0) {
            return out.join('');
        }
        out.push('.');
        const seen = new Map<number, number>();
        while (rest !== 0) {
            if (seen.has(rest)) {
                out.splice(seen.get(rest)!, 0, '(');
                out.push(')');
                break;
            }
            seen.set(rest, out.length);
            rest *= 10;
            out.push(String(Math.floor(rest / divisor)));
            rest %= divisor;
        }
        return out.join('');
    }
}
