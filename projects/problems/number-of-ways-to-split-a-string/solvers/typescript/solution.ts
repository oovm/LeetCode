export class Solution {
    numWays(s: string): number {
        const MOD = 1000000007;
        const ones = [...s].filter((c) => c === '1').length;
        if (ones % 3 !== 0) {
            return 0;
        }
        if (ones === 0) {
            return (((s.length - 1) * (s.length - 2)) / 2) % MOD;
        }
        const third = ones / 3;
        let count = 0;
        let gap1 = 0;
        let gap2 = 0;
        for (const ch of s) {
            if (ch === '1') count += 1;
            else if (count === third) gap1 += 1;
            else if (count === 2 * third) gap2 += 1;
        }
        return ((gap1 % MOD) * (gap2 % MOD)) % MOD;
    }
}
