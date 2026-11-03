export class Solution {
    checkValid(matrix: number[][]): boolean {
        const n = matrix.length;
        const full = (n * (n + 1)) / 2;
        for (let i = 0; i < n; i++) {
            let rowSum = 0;
            let colSum = 0;
            const rowSeen = new Set<number>();
            const colSeen = new Set<number>();
            for (let j = 0; j < n; j++) {
                rowSum += matrix[i][j];
                rowSeen.add(matrix[i][j]);
                colSum += matrix[j][i];
                colSeen.add(matrix[j][i]);
            }
            if (rowSum !== full || colSum !== full) return false;
            if (rowSeen.size !== n || colSeen.size !== n) return false;
        }
        return true;
    }
}
