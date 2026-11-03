export class Solution {
    numDecodings(s: string): number {
        const MOD = 1000000007;
        const one = (c: string): number => (c === '*' ? 9 : c === '0' ? 0 : 1);
        const two = (a: string, b: string): number => {
            if (a === '*' && b === '*') return 15;
            if (a === '*') return b <= '6' ? 2 : 1;
            if (b === '*') {
                if (a === '1') return 9;
                if (a === '2') return 6;
                return 0;
            }
            const v = Number(a) * 10 + Number(b);
            return v >= 10 && v <= 26 ? 1 : 0;
        };
        let prev2 = 1;
        let prev1 = one(s[0]);
        for (let i = 1; i < s.length; i++) {
            const cur = (prev1 * one(s[i]) + prev2 * two(s[i - 1], s[i])) % MOD;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}
