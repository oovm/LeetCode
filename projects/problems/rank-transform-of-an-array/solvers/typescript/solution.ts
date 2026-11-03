export class Solution {
    arrayRankTransform(arr: number[]): number[] {
        const sorted = [...new Set(arr)].sort((a, b) => a - b);
        const rank = new Map<number, number>();
        sorted.forEach((v, i) => rank.set(v, i + 1));
        return arr.map((v) => rank.get(v)!);
    }
}
