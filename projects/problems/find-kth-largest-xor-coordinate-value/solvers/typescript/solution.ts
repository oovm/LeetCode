export class Solution {
    kthLargestValue(matrix: number[][], k: number): number {
        const rows = matrix.length;
        const columns = matrix[0].length;
        const stride = columns + 1;
        const prefix = new Array<number>((rows + 1) * stride).fill(0);
        const values: number[] = [];
        for (let row = 1; row <= rows; row += 1) {
            for (let column = 1; column <= columns; column += 1) {
                const value =
                    prefix[(row - 1) * stride + column] ^
                    prefix[row * stride + (column - 1)] ^
                    prefix[(row - 1) * stride + (column - 1)] ^
                    matrix[row - 1][column - 1];
                prefix[row * stride + column] = value;
                values.push(value);
            }
        }
        values.sort((a, b) => a - b);
        return values[values.length - k];
    }
}
