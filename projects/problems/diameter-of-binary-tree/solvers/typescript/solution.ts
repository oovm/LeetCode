export class Solution {
    diameterOfBinaryTree(root: (number | null)[]): number {
        let best = 0;
        const depth = (i: number): number => {
            if (i >= root.length || root[i] === null) return 0;
            const left = depth(2 * i + 1);
            const right = depth(2 * i + 2);
            best = Math.max(best, left + right);
            return Math.max(left, right) + 1;
        };
        depth(0);
        return best;
    }
}
