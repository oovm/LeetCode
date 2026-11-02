export class Solution {
    maxDepth(root: (number | null)[]): number {
        const depth = (i: number): number => {
            if (i >= root.length || root[i] === null) {
                return 0;
            }
            return 1 + Math.max(depth(2 * i + 1), depth(2 * i + 2));
        };
        return depth(0);
    }
}
