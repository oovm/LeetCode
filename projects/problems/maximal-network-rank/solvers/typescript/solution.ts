export class Solution {
    maximalNetworkRank(n: number, roads: number[][]): number {
        const degree = new Array<number>(n).fill(0);
        const linked = new Set<string>();
        for (const [a, b] of roads) {
            degree[a]++;
            degree[b]++;
            linked.add(a < b ? `${a},${b}` : `${b},${a}`);
        }
        let best = 0;
        for (let a = 0; a < n; a++) {
            for (let b = a + 1; b < n; b++) {
                const rank = degree[a] + degree[b] - (linked.has(`${a},${b}`) ? 1 : 0);
                if (rank > best) best = rank;
            }
        }
        return best;
    }
}
