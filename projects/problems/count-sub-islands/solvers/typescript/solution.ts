export class Solution {
    countSubIslands(grid1: number[][], grid2: number[][]): number {
        const rows = grid1.length;
        if (rows === 0) return 0;
        const cols = grid1[0].length;
        const seen = new Array<boolean>(rows * cols).fill(false);
        let total = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const start = row * cols + col;
                if (grid2[row][col] !== 1 || seen[start]) continue;
                let allInside = true;
                const stack = [start];
                seen[start] = true;
                while (stack.length > 0) {
                    const cell = stack.pop()!;
                    const currentRow = Math.floor(cell / cols);
                    const currentCol = cell % cols;
                    if (grid1[currentRow][currentCol] !== 1) allInside = false;
                    const neighbors: Array<[number, number]> = [
                        [currentRow - 1, currentCol],
                        [currentRow + 1, currentCol],
                        [currentRow, currentCol - 1],
                        [currentRow, currentCol + 1],
                    ];
                    for (const [nextRow, nextCol] of neighbors) {
                        if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                        const target = nextRow * cols + nextCol;
                        if (grid2[nextRow][nextCol] !== 1 || seen[target]) continue;
                        seen[target] = true;
                        stack.push(target);
                    }
                }
                if (allInside) total++;
            }
        }
        return total;
    }
}
