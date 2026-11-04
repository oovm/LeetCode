export class Solution {
    containsCycle(grid: string[][]): boolean {
        const rows = grid.length;
        if (rows === 0) return false;
        const cols = grid[0].length;
        const visited = new Array<boolean>(rows * cols).fill(false);
        const directions: Array<[number, number]> = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const start = row * cols + col;
                if (visited[start]) continue;

                // 迭代 DFS，栈里同时保存当前格与其父格。
                const cells: number[] = [start];
                const parents: number[] = [-1];
                visited[start] = true;

                while (cells.length > 0) {
                    const cell = cells.pop()!;
                    const parent = parents.pop()!;
                    const currentRow = Math.floor(cell / cols);
                    const currentCol = cell % cols;
                    const mark = grid[currentRow][currentCol];

                    for (const [dr, dc] of directions) {
                        const nextRow = currentRow + dr;
                        const nextCol = currentCol + dc;
                        if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                        if (grid[nextRow][nextCol] !== mark) continue;
                        const next = nextRow * cols + nextCol;
                        if (next === parent) continue;
                        // 走到已访问且非父的同类格，说明存在环。
                        if (visited[next]) return true;
                        visited[next] = true;
                        cells.push(next);
                        parents.push(cell);
                    }
                }
            }
        }
        return false;
    }
}
