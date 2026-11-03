export class Solution {
    countUnivalSubtrees(root: (number | null)[]): number {
        let count = 0;
        const dfs = (i: number): boolean => {
            if (i >= root.length || root[i] === null) return true;
            const leftOk = dfs(2 * i + 1);
            const rightOk = dfs(2 * i + 2);
            const leftVal = 2 * i + 1 < root.length ? root[2 * i + 1] : null;
            const rightVal = 2 * i + 2 < root.length ? root[2 * i + 2] : null;
            const uni =
                leftOk &&
                rightOk &&
                (leftVal === null || leftVal === root[i]) &&
                (rightVal === null || rightVal === root[i]);
            if (uni) count++;
            return uni;
        };
        dfs(0);
        return count;
    }
}
