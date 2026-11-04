export class Solution {
    findMaxFish(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) return 0;
        const cols = grid[0].length;
        const seen = new Array<boolean>(rows * cols).fill(false);
        let best = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const start = row * cols + col;
                if (grid[row][col] <= 0 || seen[start]) continue;
                let total = 0;
                const stack = [start];
                seen[start] = true;
                while (stack.length > 0) {
                    const cell = stack.pop()!;
                    const currentRow = Math.floor(cell / cols);
                    const currentCol = cell % cols;
                    total += grid[currentRow][currentCol];
                    const neighbors: Array<[number, number]> = [
                        [currentRow - 1, currentCol],
                        [currentRow + 1, currentCol],
                        [currentRow, currentCol - 1],
                        [currentRow, currentCol + 1],
                    ];
                    for (const [nextRow, nextCol] of neighbors) {
                        if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                        const target = nextRow * cols + nextCol;
                        if (grid[nextRow][nextCol] <= 0 || seen[target]) continue;
                        seen[target] = true;
                        stack.push(target);
                    }
                }
                best = Math.max(best, total);
            }
        }
        return best;
    }
}
