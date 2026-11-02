export class Solution {
    largestAltitude(gain: number[]): number {
        let best = 0;
        let cur = 0;
        for (const g of gain) {
            cur += g;
            if (cur > best) {
                best = cur;
            }
        }
        return best;
    }
}
