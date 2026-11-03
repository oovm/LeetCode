export class Solution {
    isRationalEqual(s: string, t: string): boolean {
        const toFraction = (x: string): [bigint, bigint] => {
            const match = x.match(/^(-?\d+)?(?:\.(\d+)?(?:\((\d+)\))?)?$/);
            const intPart = match?.[1] ?? '0';
            const nonRepeat = match?.[2] ?? '';
            const repeat = match?.[3] ?? '';
            let numerator = BigInt(intPart + nonRepeat + (repeat || '')) - BigInt(intPart + nonRepeat);
            let denominator = BigInt('9'.repeat(repeat.length) + '0'.repeat(nonRepeat.length));
            if (repeat === '') {
                numerator = BigInt(intPart + nonRepeat);
                denominator = BigInt('1' + '0'.repeat(nonRepeat.length));
            }
            if (denominator === 0n) denominator = 1n;
            const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? a : gcd(b, a % b));
            const g = gcd(numerator < 0n ? -numerator : numerator, denominator);
            return [numerator / g, denominator / g];
        };
        const [a, b] = toFraction(s);
        const [c, d] = toFraction(t);
        return a * d === b * c;
    }
}
