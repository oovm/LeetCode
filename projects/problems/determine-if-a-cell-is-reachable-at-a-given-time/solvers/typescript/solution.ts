export class Solution {
    isReachableAtTime(sx: number, sy: number, fx: number, fy: number, t: number): boolean {
        if (sx === fx && sy === fy) {
            return t !== 1;
        }
        return Math.max(Math.abs(sx - fx), Math.abs(sy - fy)) <= t;
    }
}
