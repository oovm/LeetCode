export class Solution {
    minDiffInBST(root: (number | null)[]): number {
        let prev: number | null = null;
        let best = Number.MAX_SAFE_INTEGER;
        const walk = (i: number): void => {
            if (i >= root.length || root[i] === null) return;
            walk(2 * i + 1);
            if (prev !== null) best = Math.min(best, root[i]! - prev);
            prev = root[i];
            walk(2 * i + 2);
        };
        walk(0);
        return best;
    }
}
