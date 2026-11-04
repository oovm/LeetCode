export class Solution {
    maximumSafenessFactor(grid: number[][]): number {
        const n = grid.length;
        const total = n * n;
        const safeness = new Array<number>(total).fill(-1);
        const queue: number[] = [];
        for (let row = 0; row < n; row += 1) {
            for (let col = 0; col < n; col += 1) {
                if (grid[row][col] === 1) {
                    safeness[row * n + col] = 0;
                    queue.push(row * n + col);
                }
            }
        }
        if (queue.length === 0) return n - 1;

        let head = 0;
        while (head < queue.length) {
            const cell = queue[head];
            head += 1;
            const row = Math.floor(cell / n);
            const col = cell % n;
            for (const [drow, dcol] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const nextRow = row + drow;
                const nextCol = col + dcol;
                if (nextRow < 0 || nextRow >= n || nextCol < 0 || nextCol >= n) continue;
                const next = nextRow * n + nextCol;
                if (safeness[next] === -1) {
                    safeness[next] = safeness[cell] + 1;
                    queue.push(next);
                }
            }
        }

        const reachable = (limit: number): boolean => {
            if (safeness[0] < limit) return false;
            const visited = new Array<boolean>(total).fill(false);
            visited[0] = true;
            const cells: number[] = [0];
            let cursor = 0;
            while (cursor < cells.length) {
                const cell = cells[cursor];
                cursor += 1;
                if (cell === total - 1) return true;
                const row = Math.floor(cell / n);
                const col = cell % n;
                for (const [drow, dcol] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const nextRow = row + drow;
                    const nextCol = col + dcol;
                    if (nextRow < 0 || nextRow >= n || nextCol < 0 || nextCol >= n) continue;
                    const next = nextRow * n + nextCol;
                    if (!visited[next] && safeness[next] >= limit) {
                        visited[next] = true;
                        cells.push(next);
                    }
                }
            }
            return false;
        };

        let low = 0;
        let high = n - 1;
        while (low < high) {
            const middle = Math.floor((low + high + 1) / 2);
            if (reachable(middle)) low = middle;
            else high = middle - 1;
        }
        return low;
    }
}
