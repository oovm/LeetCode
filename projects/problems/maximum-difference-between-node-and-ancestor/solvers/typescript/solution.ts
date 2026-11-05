export class Solution {
    maxAncestorDiff(root: number[]): number {
        let best = 0;
        const walk = (index: number, low: number, high: number) => {
            if (index >= root.length) {
                return;
            }
            const value = root[index];
            best = Math.max(best, Math.abs(low - value), Math.abs(high - value));
            const nextLow = Math.min(low, value);
            const nextHigh = Math.max(high, value);
            walk(index * 2 + 1, nextLow, nextHigh);
            walk(index * 2 + 2, nextLow, nextHigh);
        };
        walk(0, root[0], root[0]);
        return best;
    }
}
