export class Solution {
    leafSimilar(root1: (number | null)[], root2: (number | null)[]): boolean {
        const leaves = (root: (number | null)[]): number[] => {
            const out: number[] = [];
            const walk = (i: number): void => {
                if (i >= root.length || root[i] === null) return;
                const hasLeft = 2 * i + 1 < root.length && root[2 * i + 1] !== null;
                const hasRight = 2 * i + 2 < root.length && root[2 * i + 2] !== null;
                if (!hasLeft && !hasRight) {
                    out.push(root[i]!);
                    return;
                }
                walk(2 * i + 1);
                walk(2 * i + 2);
            };
            walk(0);
            return out;
        };
        const a = leaves(root1);
        const b = leaves(root2);
        return a.length === b.length && a.every((v, i) => v === b[i]);
    }
}
