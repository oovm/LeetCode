export class Solution {
    spiralOrder(matrix: number[][]): number[] {
        const result: number[] = [];
        let top = 0;
        let bottom = matrix.length - 1;
        let left = 0;
        let right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (let j = left; j <= right; j++) result.push(matrix[top][j]);
            top++;
            for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
            right--;
            if (top > bottom) break;
            for (let j = right; j >= left; j--) result.push(matrix[bottom][j]);
            bottom--;
            if (left > right) break;
            for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
            left++;
        }
        return result;
    }
}
