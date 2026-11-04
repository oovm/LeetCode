export class Solution {
    countPairs(n: number, edges: number[][]): number {
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
                if (size[rootA] < size[rootB]) {
                    parent[rootA] = rootB;
                    size[rootB] += size[rootA];
                } else {
                    parent[rootB] = rootA;
                    size[rootA] += size[rootB];
                }
            }
        }
        let intraComponent = 0;
        for (let i = 0; i < n; i++) {
            if (find(i) === i) intraComponent += size[i] * (size[i] - 1) / 2;
        }
        return n * (n - 1) / 2 - intraComponent;
    }
}
