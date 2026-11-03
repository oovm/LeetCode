export class Solution {
    shortestDistance(maze: number[][], start: number[], destination: number[]): number {
        const m = maze.length;
        const n = maze[0].length;
        const dist = Array.from({ length: m }, () => new Array<number>(n).fill(Infinity));
        dist[start[0]][start[1]] = 0;
        const queue = [start];
        for (let head = 0; head < queue.length; head++) {
            const [i, j] = queue[head];
            for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                let ni = i;
                let nj = j;
                let steps = 0;
                while (
                    ni + di >= 0 && ni + di < m && nj + dj >= 0 && nj + dj < n &&
                    maze[ni + di][nj + dj] === 0
                ) {
                    ni += di;
                    nj += dj;
                    steps++;
                }
                if (dist[i][j] + steps < dist[ni][nj]) {
                    dist[ni][nj] = dist[i][j] + steps;
                    queue.push([ni, nj]);
                }
            }
        }
        return dist[destination[0]][destination[1]] === Infinity
            ? -1
            : dist[destination[0]][destination[1]];
    }
}
