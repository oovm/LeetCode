export class Solution {
    makeConnected(n: number, connections: number[][]): number {
        if (connections.length < n - 1) return -1;
        const parent = new Array<number>(n).fill(0).map((_, index) => index);
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
        let groups = n;
        for (const [left, right] of connections) {
            const a = find(left);
            const b = find(right);
            if (a !== b) {
                parent[a] = b;
                groups--;
            }
        }
        return groups - 1;
    }
}
