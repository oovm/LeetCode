export class Solution {
    orangesRotting(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) return 0;
        const cols = grid[0].length;
        let fresh = 0;
        const queue: number[] = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col] === 1) fresh++;
                else if (grid[row][col] === 2) queue.push(row * cols + col);
            }
        }
        if (fresh === 0) return 0;
        const infect = (row: number, col: number): void => {
            if (row < 0 || row >= rows || col < 0 || col >= cols) return;
            if (grid[row][col] !== 1) return;
            grid[row][col] = 2;
            fresh--;
            queue.push(row * cols + col);
        };
        let minutes = 0;
        let head = 0;
        while (head < queue.length) {
            const level = queue.length - head;
            for (let step = 0; step < level; step++) {
                const cell = queue[head++];
                const row = Math.floor(cell / cols);
                const col = cell % cols;
                infect(row - 1, col);
                infect(row + 1, col);
                infect(row, col - 1);
                infect(row, col + 1);
            }
            minutes++;
        }
        return fresh > 0 ? -1 : minutes - 1;
    }
}
