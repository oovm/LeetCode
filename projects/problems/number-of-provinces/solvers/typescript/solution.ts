export class Solution {
    findCircleNum(isConnected: number[][]): number {
        const n = isConnected.length;
        const parent = Array.from({ length: n }, (_, i) => i);
        const find = (x: number): number => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (isConnected[i][j] === 1) parent[find(i)] = find(j);
            }
        }
        return new Set(parent.map((_, i) => find(i))).size;
    }
}
