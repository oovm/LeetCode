export class Solution {
    rightSideView(root: (number | null)[]): number[] {
        const result: number[] = [];
        const dfs = (i: number, depth: number) => {
            if (i >= root.length || root[i] === null) return;
            if (depth === result.length) result.push(root[i]!);
            dfs(2 * i + 2, depth + 1);
            dfs(2 * i + 1, depth + 1);
        };
        dfs(0, 0);
        return result;
    }
}
