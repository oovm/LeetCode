export class Solution {
    fairCandySwap(aliceSizes: number[], bobSizes: number[]): number[] {
        const sumA = aliceSizes.reduce((a, b) => a + b, 0);
        const sumB = bobSizes.reduce((a, b) => a + b, 0);
        const diff = (sumA - sumB) / 2;
        const bob = new Set(bobSizes);
        for (const a of aliceSizes) {
            if (bob.has(a - diff)) return [a, a - diff];
        }
        return [];
    }
}
