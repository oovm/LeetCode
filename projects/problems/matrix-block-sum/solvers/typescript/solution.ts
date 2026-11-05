export class Solution {
    matrixBlockSum(mat: number[][], k: number): number[][] {
        const m = mat.length;
        const n = mat[0].length;
        const prefix = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
        for (let i = 1; i <= m; i += 1) {
            for (let j = 1; j <= n; j += 1) {
                prefix[i][j] = prefix[i - 1][j] + prefix[i][j - 1] - prefix[i - 1][j - 1] + mat[i - 1][j - 1];
            }
        }
        const answer: number[][] = [];
        for (let i = 0; i < m; i += 1) {
            const row: number[] = [];
            for (let j = 0; j < n; j += 1) {
                const x1 = Math.max(i - k, 0);
                const y1 = Math.max(j - k, 0);
                const x2 = Math.min(i + k, m - 1);
                const y2 = Math.min(j + k, n - 1);
                row.push(
                    prefix[x2 + 1][y2 + 1] - prefix[x1][y2 + 1] - prefix[x2 + 1][y1] + prefix[x1][y1],
                );
            }
            answer.push(row);
        }
        return answer;
    }
}
