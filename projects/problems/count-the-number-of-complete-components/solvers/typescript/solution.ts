export class Solution {
    countCompleteComponents(n: number, edges: number[][]): number {
        const parent = new Array<number>(n);
        const size = new Array<number>(n).fill(1);
        for (let i = 0; i < n; i++) parent[i] = i;
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        for (const [a, b] of edges) {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) {
                parent[rootA] = rootB;
                size[rootB] += size[rootA];
            }
        }
        const links = new Map<number, number>();
        for (const [a] of edges) {
            const root = find(a);
            links.set(root, (links.get(root) ?? 0) + 1);
        }
        let complete = 0;
        for (let i = 0; i < n; i++) {
            if (find(i) !== i) continue;
            const memberCount = size[i];
            const linkCount = links.get(i) ?? 0;
            if (linkCount === memberCount * (memberCount - 1) / 2) complete++;
        }
        return complete;
    }
}
