export class Solution {
    matrixReshape(mat: number[][], r: number, c: number): number[][] {
        const flat = mat.flat();
        if (flat.length !== r * c) return mat;
        const out: number[][] = [];
        for (let i = 0; i < r; i++) out.push(flat.slice(i * c, i * c + c));
        return out;
    }
}
