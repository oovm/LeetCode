export class Solution {
    findMinHeightTrees(n: number, edges: number[][]): number[] {
        if (n === 1) return [0];
        const adj: number[][] = Array.from({ length: n }, () => []);
        for (const [a, b] of edges) {
            adj[a].push(b);
            adj[b].push(a);
        }
        let leaves = adj.flatMap((a, i) => (a.length === 1 ? [i] : []));
        let remaining = n;
        while (remaining > 2) {
            remaining -= leaves.length;
            const next: number[] = [];
            for (const leaf of leaves) {
                const neighbor = adj[leaf].pop()!;
                const list = adj[neighbor];
                list.splice(list.indexOf(leaf), 1);
                if (list.length === 1) next.push(neighbor);
            }
            leaves = next;
        }
        return leaves;
    }
}
