export class Solution {
    kWeakestRows(mat: number[][], k: number): number[] {
        return mat
            .map((row, i) => [row.filter((v) => v === 1).length, i] as const)
            .sort((a, b) => a[0] - b[0] || a[1] - b[1])
            .slice(0, k)
            .map(([, i]) => i);
    }
}
