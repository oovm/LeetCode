export class Solution {
    removeStones(stones: number[][]): number {
        const parent = new Map<number, number>();
        const find = (x: number): number => {
            const stored = parent.get(x);
            if (stored === undefined) {
                parent.set(x, x);
                return x;
            }
            if (stored === x) return x;
            const root = find(stored);
            parent.set(x, root);
            return root;
        };
        const union = (a: number, b: number): void => {
            const rootA = find(a);
            const rootB = find(b);
            if (rootA !== rootB) parent.set(rootA, rootB);
        };
        for (const [row, column] of stones) union(row, -column - 1);
        const roots = new Set<number>();
        for (const id of Array.from(parent.keys())) roots.add(find(id));
        return stones.length - roots.size;
    }
}
