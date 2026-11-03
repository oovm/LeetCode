export class Solution {
    countComponents(n: number, edges: number[][]): number {
        const parent = Array.from({ length: n }, (_, i) => i);
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        for (const [a, b] of edges) parent[find(a)] = find(b);
        return new Set(parent.map((_, i) => find(i))).size;
    }
}
