export class Solution {
    findRedundantConnection(edges: number[][]): number[] {
        const parent = new Array<number>(edges.length + 1).fill(0).map((_, index) => index);
        const find = (value: number): number => {
            let root = value;
            while (parent[root] !== root) root = parent[root];
            let cursor = value;
            while (parent[cursor] !== root) {
                const next = parent[cursor];
                parent[cursor] = root;
                cursor = next;
            }
            return root;
        };
        for (const [from, to] of edges) {
            const left = find(from);
            const right = find(to);
            if (left === right) return [from, to];
            parent[left] = right;
        }
        return [];
    }
}
