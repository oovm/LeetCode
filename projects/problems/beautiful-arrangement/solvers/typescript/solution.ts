export class Solution {
    countArrangement(n: number): number {
        const visited = new Array<boolean>(n + 1).fill(false);
        const dfs = (position: number): number => {
            if (position > n) {
                return 1;
            }
            let total = 0;
            for (let value = 1; value <= n; value++) {
                if (visited[value]) {
                    continue;
                }
                if (value % position !== 0 && position % value !== 0) {
                    continue;
                }
                visited[value] = true;
                total += dfs(position + 1);
                visited[value] = false;
            }
            return total;
        };
        return dfs(1);
    }
}
