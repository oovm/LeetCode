export class Solution {
    numberOfUniqueGoodSubsequences(binary: string): number {
        const MOD = 1000000007;
        let endsWith0 = 0;
        let endsWith1 = 0;
        let hasZero = false;
        for (const ch of binary) {
            if (ch === '0') {
                hasZero = true;
                endsWith0 = (endsWith0 + endsWith1) % MOD;
            } else {
                endsWith1 = (endsWith0 + endsWith1 + 1) % MOD;
            }
        }
        return (endsWith0 + endsWith1 + (hasZero ? 1 : 0)) % MOD;
    }
}
