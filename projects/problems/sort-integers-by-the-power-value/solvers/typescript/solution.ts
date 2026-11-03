export class Solution {
    getKth(lo: number, hi: number, k: number): number {
        const memo = new Map<number, number>([[1, 0]]);
        const power = (x: number): number => {
            const hit = memo.get(x);
            if (hit !== undefined) {
                return hit;
            }
            const steps = 1 + power(x % 2 === 0 ? x / 2 : 3 * x + 1);
            memo.set(x, steps);
            return steps;
        };
        const pairs = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map(
            (x) => [power(x), x] as [number, number],
        );
        pairs.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        return pairs[k - 1][1];
    }
}
