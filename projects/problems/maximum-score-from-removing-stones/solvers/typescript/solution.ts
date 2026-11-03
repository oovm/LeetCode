export class Solution {
    maximumScore(a: number, b: number, c: number): number {
        const [x, y, z] = [a, b, c].sort((p, q) => p - q) as [number, number, number];
        return z >= x + y ? x + y : Math.floor((x + y + z) / 2);
    }
}
