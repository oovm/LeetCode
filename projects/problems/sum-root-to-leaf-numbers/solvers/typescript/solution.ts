export class Solution {
    sumNumbers(root: (number | null)[]): number {
        const dfs = (i: number, acc: number): number => {
            if (i >= root.length || root[i] === null) return 0;
            const v = acc * 10 + root[i]!;
            const left = dfs(2 * i + 1, v);
            const right = dfs(2 * i + 2, v);
            return left + right === 0 ? v : left + right;
        };
        return dfs(0, 0);
    }
}
