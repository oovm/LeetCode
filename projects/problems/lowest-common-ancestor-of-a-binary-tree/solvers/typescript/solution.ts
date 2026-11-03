export class Solution {
    lowestCommonAncestor(root: (number | null)[], p: number, q: number): number {
        let answer = 0;
        const dfs = (i: number): boolean => {
            if (i >= root.length || root[i] === null) return false;
            const self = root[i] === p || root[i] === q;
            const left = dfs(2 * i + 1);
            const right = dfs(2 * i + 2);
            if ((left && right) || (self && (left || right))) answer = root[i]!;
            return self || left || right;
        };
        dfs(0);
        return answer;
    }
}
