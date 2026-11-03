export class Solution {
    minOperations(k: number): number {
        let best = k - 1;
        for (let v = 1; v <= k; v++) {
            best = Math.min(best, v - 1 + Math.ceil((k - v) / v));
        }
        return best;
    }
}
