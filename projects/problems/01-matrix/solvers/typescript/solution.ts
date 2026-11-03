export class Solution {
    updateMatrix(mat: number[][]): number[][] {
        const m = mat.length;
        const n = mat[0].length;
        const dist = Array.from({ length: m }, () => new Array<number>(n).fill(Infinity));
        const queue: number[] = [];
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (mat[i][j] === 0) {
                    dist[i][j] = 0;
                    queue.push(i * n + j);
                }
            }
        }
        for (let head = 0; head < queue.length; head++) {
            const i = Math.floor(queue[head] / n);
            const j = queue[head] % n;
            for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const ni = i + di;
                const nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && dist[ni][nj] > dist[i][j] + 1) {
                    dist[ni][nj] = dist[i][j] + 1;
                    queue.push(ni * n + nj);
                }
            }
        }
        return dist;
    }
}
