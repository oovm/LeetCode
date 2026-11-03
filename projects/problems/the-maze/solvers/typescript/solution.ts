export class Solution {
    hasPath(maze: number[][], start: number[], destination: number[]): boolean {
        const m = maze.length;
        const n = maze[0].length;
        const seen = Array.from({ length: m }, () => new Array<boolean>(n).fill(false));
        const queue = [start];
        for (let head = 0; head < queue.length; head++) {
            const [i, j] = queue[head];
            if (seen[i][j]) continue;
            seen[i][j] = true;
            if (i === destination[0] && j === destination[1]) return true;
            for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                let ni = i;
                let nj = j;
                while (
                    ni + di >= 0 && ni + di < m && nj + dj >= 0 && nj + dj < n &&
                    maze[ni + di][nj + dj] === 0
                ) {
                    ni += di;
                    nj += dj;
                }
                if (!seen[ni][nj]) queue.push([ni, nj]);
            }
        }
        return false;
    }
}
