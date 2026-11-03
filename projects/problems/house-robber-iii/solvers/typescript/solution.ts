export class Solution {
    rob(root: (number | null)[]): number {
        const dfs = (i: number): [number, number] => {
            if (i >= root.length || root[i] === null) return [0, 0];
            const [lt, ls] = dfs(2 * i + 1);
            const [rt, rs] = dfs(2 * i + 2);
            return [root[i]! + ls + rs, Math.max(lt, ls) + Math.max(rt, rs)];
        };
        const [take, skip] = dfs(0);
        return Math.max(take, skip);
    }
}
