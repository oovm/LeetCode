export class Solution {
    hasPathSum(root: (number | null)[], targetSum: number): boolean {
        const walk = (i: number, sum: number): boolean => {
            if (i >= root.length || root[i] === null) return false;
            const next = sum + root[i]!;
            const isLeaf =
                (2 * i + 1 >= root.length || root[2 * i + 1] === null) &&
                (2 * i + 2 >= root.length || root[2 * i + 2] === null);
            return next === targetSum && isLeaf ? true : walk(2 * i + 1, next) || walk(2 * i + 2, next);
        };
        return walk(0, 0);
    }
}
