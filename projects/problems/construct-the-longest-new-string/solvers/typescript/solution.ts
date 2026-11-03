export class Solution {
    longestString(x: number, y: number, z: number): number {
        return 2 * (2 * Math.min(x, y) + (x === y ? 0 : 1)) + 2 * z;
    }
}
