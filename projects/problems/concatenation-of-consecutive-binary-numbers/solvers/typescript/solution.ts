export class Solution {
    concatenatedBinary(n: number): number {
        const MOD = 1000000007n;
        let value = 0n;
        let shift = 2n;
        for (let i = 1; i <= n; i++) {
            if (i > 1 && (i & (i - 1)) === 0) {
                shift = (shift * 2n) % MOD;
            }
            value = (value * shift + BigInt(i)) % MOD;
        }
        return Number(value);
    }
}
