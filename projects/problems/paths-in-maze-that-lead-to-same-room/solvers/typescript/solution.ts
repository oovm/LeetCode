export class Solution {
    numberOfPaths(n: number, corridors: number[][]): number {
        // 统计无向图中的三角形：枚举每个房间的邻居对，再查两者是否相邻。
        // 每个三角形被三个顶点各统计一次，最后总数除以 3。
        const adjacency: number[][] = Array.from({ length: n + 1 }, () => []);
        const linked: boolean[][] = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(false));
        for (const corridor of corridors) {
            const a = corridor[0];
            const b = corridor[1];
            if (linked[a][b]) {
                continue;
            }
            linked[a][b] = true;
            linked[b][a] = true;
            adjacency[a].push(b);
            adjacency[b].push(a);
        }
        let total = 0;
        for (let room = 1; room <= n; room += 1) {
            const neighbors = adjacency[room];
            for (let x = 0; x < neighbors.length; x += 1) {
                for (let y = x + 1; y < neighbors.length; y += 1) {
                    if (linked[neighbors[x]][neighbors[y]]) {
                        total += 1;
                    }
                }
            }
        }
        return total / 3;
    }
}
