export class Solution {
    sumRootToLeaf(root: (number | null)[]): number {
        let total = 0;
        const walk = (i: number, value: number): void => {
            if (i >= root.length || root[i] === null) return;
            const cur = value * 2 + root[i]!;
            const hasLeft = 2 * i + 1 < root.length && root[2 * i + 1] !== null;
            const hasRight = 2 * i + 2 < root.length && root[2 * i + 2] !== null;
            if (!hasLeft && !hasRight) {
                total += cur;
                return;
            }
            walk(2 * i + 1, cur);
            walk(2 * i + 2, cur);
        };
        walk(0, 0);
        return total;
    }
}
