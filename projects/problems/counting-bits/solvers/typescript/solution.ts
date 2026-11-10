export class Solution {
    countBits(n: number): number[] {
        const out: number[] = new Array(n + 1).fill(0);
        for (let i = 1; i <= n; i++) {
            out[i] = out[i >> 1] + (i & 1);
        }
        return out;
    }
}
