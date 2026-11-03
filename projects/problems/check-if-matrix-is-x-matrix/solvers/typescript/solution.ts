export class Solution {
    checkXMatrix(grid: number[][]): boolean {
        const n = grid.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const onDiagonal = i === j || i + j === n - 1;
                if (onDiagonal ? grid[i][j] === 0 : grid[i][j] !== 0) return false;
            }
        }
        return true;
    }
}
