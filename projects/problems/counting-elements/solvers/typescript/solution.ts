export class Solution {
    countElements(arr: number[]): number {
        const seen = new Set(arr);
        return arr.filter((v) => seen.has(v + 1)).length;
    }
}
