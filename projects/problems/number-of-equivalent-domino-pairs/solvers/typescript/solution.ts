export class Solution {
    numEquivDominoPairs(dominoes: number[][]): number {
        const count = new Map<number, number>();
        let pairs = 0;
        for (const [a, b] of dominoes) {
            const key = a < b ? a * 10 + b : b * 10 + a;
            const seen = count.get(key) ?? 0;
            pairs += seen;
            count.set(key, seen + 1);
        }
        return pairs;
    }
}
