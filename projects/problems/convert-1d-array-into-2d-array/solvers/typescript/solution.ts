export class Solution {
    construct2DArray(original: number[], m: number, n: number): number[][] {
        if (original.length !== m * n) return [];
        const out: number[][] = [];
        for (let i = 0; i < m; i++) {
            out.push(original.slice(i * n, (i + 1) * n));
        }
        return out;
    }
}
