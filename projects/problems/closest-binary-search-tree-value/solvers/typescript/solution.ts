export class Solution {
    closestValue(root: (number | null)[], target: number): number {
        let best = root[0]!;
        let i = 0;
        while (i < root.length && root[i] !== null) {
            const v = root[i]!;
            const d = Math.abs(v - target);
            const db = Math.abs(best - target);
            if (d < db || (d === db && v < best)) best = v;
            i = target < v ? 2 * i + 1 : 2 * i + 2;
        }
        return best;
    }
}
