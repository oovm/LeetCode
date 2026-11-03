export class Solution {
    hasGroupsSizeX(deck: number[]): boolean {
        const count = new Map<number, number>();
        for (const v of deck) count.set(v, (count.get(v) ?? 0) + 1);
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        let g = 0;
        for (const c of count.values()) g = gcd(g, c);
        return g >= 2;
    }
}
