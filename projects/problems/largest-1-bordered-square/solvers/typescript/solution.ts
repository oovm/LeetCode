export class Solution {
    largest1BorderedSquare(grid: number[][]): number {
        const rows = grid.length;
        const columns = grid[0].length;
        const down = new Array<number>(rows * columns).fill(0);
        const right = new Array<number>(rows * columns).fill(0);

        for (let row = rows - 1; row >= 0; row -= 1) {
            for (let column = columns - 1; column >= 0; column -= 1) {
                if (grid[row][column] === 0) {
                    continue;
                }
                const offset = row * columns + column;
                down[offset] = row + 1 < rows ? down[(row + 1) * columns + column] + 1 : 1;
                right[offset] = column + 1 < columns ? right[row * columns + column + 1] + 1 : 1;
            }
        }

        const limit = Math.min(rows, columns);
        for (let side = limit; side >= 1; side -= 1) {
            for (let row = 0; row + side <= rows; row += 1) {
                for (let column = 0; column + side <= columns; column += 1) {
                    const topLeft = row * columns + column;
                    const topRight = row * columns + column + side - 1;
                    const bottomLeft = (row + side - 1) * columns + column;
                    if (
                        down[topLeft] >= side &&
                        right[topLeft] >= side &&
                        right[bottomLeft] >= side &&
                        down[topRight] >= side
                    ) {
                        return side * side;
                    }
                }
            }
        }
        return 0;
    }
}
