export class Solution {
    combine(n: number, k: number): number[][] {
        const out: number[][] = [];
        const picked: number[] = [];
        const dfs = (i: number): void => {
            if (picked.length === k) {
                out.push([...picked]);
                return;
            }
            if (i > n) {
                return;
            }
            picked.push(i);
            dfs(i + 1);
            picked.pop();
            dfs(i + 1);
        };
        dfs(1);
        return out;
    }
}
