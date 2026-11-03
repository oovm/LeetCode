export class Solution {
    validPath(
        n: number,
        edges: number[][],
        source: number,
        destination: number
    ): boolean {
        const parent = Array.from({ length: n }, (_, i) => i);
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        for (const [a, b] of edges) {
            parent[find(a)] = find(b);
        }
        return find(source) === find(destination);
    }
}
