export class Solution {
    numDistinctIslands(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) return 0;
        const cols = grid[0].length;
        const shapes = new Set<string>();
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col] !== 1) continue;

                const cells: number[] = [];
                const queue: Array<[number, number]> = [[row, col]];
                grid[row][col] = 0;

                while (queue.length > 0) {
                    const [currentRow, currentCol] = queue.shift()!;
                    cells.push((currentRow - row) * 1000 + (currentCol - col));

                    for (const [deltaRow, deltaCol] of directions) {
                        const nextRow = currentRow + deltaRow;
                        const nextCol = currentCol + deltaCol;
                        if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                        if (grid[nextRow][nextCol] !== 1) continue;
                        grid[nextRow][nextCol] = 0;
                        queue.push([nextRow, nextCol]);
                    }
                }

                shapes.add(cells.join(","));
            }
        }
        return shapes.size;
    }
}
