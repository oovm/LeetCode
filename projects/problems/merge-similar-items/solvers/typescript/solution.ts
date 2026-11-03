export class Solution {
    mergeSimilarItems(items1: number[][], items2: number[][]): number[][] {
        const weight = new Map<number, number>();
        for (const [v, w] of [...items1, ...items2]) {
            weight.set(v, (weight.get(v) ?? 0) + w);
        }
        return [...weight.entries()].sort((a, b) => a[0] - b[0]);
    }
}
