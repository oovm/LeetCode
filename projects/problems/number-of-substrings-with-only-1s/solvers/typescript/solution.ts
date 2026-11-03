export class Solution {
    numSub(s: string): number {
        const MOD = 1000000007;
        let total = 0;
        let run = 0;
        for (const ch of s) {
            run = ch === '1' ? run + 1 : 0;
            total = (total + run) % MOD;
        }
        return total;
    }
}
