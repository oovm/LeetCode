export class Solution {
    numEnclaves(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) return 0;
        const cols = grid[0].length;
        const seen = new Array<boolean>(rows * cols).fill(false);
        const stack: number[] = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col] !== 1) continue;
                if (row === 0 || row === rows - 1 || col === 0 || col === cols - 1) {
                    seen[row * cols + col] = true;
                    stack.push(row * cols + col);
                }
            }
        }
        const push = (row: number, col: number): void => {
            if (row < 0 || row >= rows || col < 0 || col >= cols) return;
            if (grid[row][col] !== 1) return;
            const index = row * cols + col;
            if (seen[index]) return;
            seen[index] = true;
            stack.push(index);
        };
        while (stack.length > 0) {
            const cell = stack.pop()!;
            const row = Math.floor(cell / cols);
            const col = cell % cols;
            push(row - 1, col);
            push(row + 1, col);
            push(row, col - 1);
            push(row, col + 1);
        }
        let total = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col] === 1 && !seen[row * cols + col]) total++;
            }
        }
        return total;
    }
}
