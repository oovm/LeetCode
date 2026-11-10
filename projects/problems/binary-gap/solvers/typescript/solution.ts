export class Solution {
    binaryGap(n: number): number {
        let best = 0;
        let last = -1;
        let bit = 0;
        while (n > 0) {
            if (n & 1) {
                if (last >= 0) best = Math.max(best, bit - last);
                last = bit;
            }
            n >>>= 1;
            bit++;
        }
        return best;
    }
}
