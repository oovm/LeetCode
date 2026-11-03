export class Solution {
    countHomogenous(s: string): number {
        const MOD = 1000000007;
        let total = 0;
        let run = 0;
        for (let i = 0; i < s.length; i++) {
            run = i > 0 && s[i] === s[i - 1] ? run + 1 : 1;
            total = (total + run) % MOD;
        }
        return total;
    }
}
