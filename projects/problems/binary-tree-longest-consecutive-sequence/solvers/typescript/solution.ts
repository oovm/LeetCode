export class Solution {
    longestConsecutive(root: (number | null)[]): number {
        let best = 0;
        const dfs = (i: number, parent: number | null, len: number) => {
            if (i >= root.length || root[i] === null) return;
            const cur = parent !== null && root[i] === parent + 1 ? len + 1 : 1;
            best = Math.max(best, cur);
            dfs(2 * i + 1, root[i], cur);
            dfs(2 * i + 2, root[i], cur);
        };
        dfs(0, null, 0);
        return best;
    }
}
