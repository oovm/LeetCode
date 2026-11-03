export class Solution {
    isBalanced(root: (number | null)[]): boolean {
        const height = (i: number): number => {
            if (i >= root.length || root[i] === null) return 0;
            const left = height(2 * i + 1);
            const right = height(2 * i + 2);
            if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
            return Math.max(left, right) + 1;
        };
        return height(0) !== -1;
    }
}
