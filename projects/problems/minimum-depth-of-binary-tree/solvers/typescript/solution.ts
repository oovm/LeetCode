export class Solution {
    minDepth(root: (number | null)[]): number {
        const depth = (i: number): number => {
            if (i >= root.length || root[i] === null) return Infinity;
            const left = depth(2 * i + 1);
            const right = depth(2 * i + 2);
            if (left === Infinity && right === Infinity) return 1;
            return Math.min(left, right) + 1;
        };
        return root.length === 0 ? 0 : depth(0);
    }
}
