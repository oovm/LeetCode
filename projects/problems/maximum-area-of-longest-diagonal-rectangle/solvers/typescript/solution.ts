export class Solution {
    areaOfMaxDiagonal(dimensions: number[][]): number {
        let bestDiag = 0;
        let bestArea = 0;
        for (const [l, w] of dimensions) {
            const diag = l * l + w * w;
            const area = l * w;
            if (diag > bestDiag || (diag === bestDiag && area > bestArea)) {
                bestDiag = diag;
                bestArea = area;
            }
        }
        return bestArea;
    }
}
