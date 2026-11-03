export class Solution {
    pathSum(root: (number | null)[], targetSum: number): number[][] {
        const result: number[][] = [];
        const path: number[] = [];
        const dfs = (i: number, rest: number) => {
            if (i >= root.length || root[i] === null) return;
            const v = root[i]!;
            path.push(v);
            const isLeaf =
                (2 * i + 1 >= root.length || root[2 * i + 1] === null) &&
                (2 * i + 2 >= root.length || root[2 * i + 2] === null);
            if (isLeaf && rest - v === 0) result.push([...path]);
            dfs(2 * i + 1, rest - v);
            dfs(2 * i + 2, rest - v);
            path.pop();
        };
        dfs(0, targetSum);
        return result;
    }
}
