export class Solution {
    maximumMinimumPath(grid: number[][]): number {
        // 对路径最小值的下界二分，再用 BFS 判定只走不小于该值的格子能否连通首尾。
        const rows = grid.length;
        const cols = grid[0].length;
        const total = rows * cols;
        const reachable = (limit: number): boolean => {
            if (grid[0][0] < limit) return false;
            const visited = new Array<boolean>(total).fill(false);
            visited[0] = true;
            const queue: number[] = [0];
            let head = 0;
            while (head < queue.length) {
                const cell = queue[head];
                head += 1;
                if (cell === total - 1) return true;
                const row = Math.floor(cell / cols);
                const col = cell % cols;
                for (const [drow, dcol] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const nextRow = row + drow;
                    const nextCol = col + dcol;
                    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                    const next = nextRow * cols + nextCol;
                    if (visited[next] || grid[nextRow][nextCol] < limit) continue;
                    visited[next] = true;
                    queue.push(next);
                }
            }
            return false;
        };

        let low = 0;
        let high = 1000000000;
        while (low < high) {
            const middle = Math.floor((low + high + 1) / 2);
            if (reachable(middle)) low = middle;
            else high = middle - 1;
        }
        return low;
    }
}
