export class Solution {
    numberOfChild(n: number, k: number): number {
        const period = 2 * (n - 1);
        const r = k % period;
        return r < n ? r : period - r;
    }
}
