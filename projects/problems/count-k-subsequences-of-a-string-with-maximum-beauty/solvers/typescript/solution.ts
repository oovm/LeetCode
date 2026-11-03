export class Solution {
    countKSubsequencesWithMaxBeauty(s: string, k: number): number {
        const MOD = 1000000007n;
        const modPow = (base: bigint, exp: bigint): bigint => {
            let result = 1n;
            let b = base % MOD;
            let e = exp;
            while (e > 0n) {
                if (e % 2n === 1n) result = (result * b) % MOD;
                b = (b * b) % MOD;
                e /= 2n;
            }
            return result;
        };
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        const freqs = counts.filter((c) => c > 0).sort((a, b) => b - a);
        if (k > freqs.length) return 0;
        const cutoff = freqs[k - 1];
        const bigger = freqs.filter((f) => f > cutoff).length;
        const sameCount = freqs.filter((f) => f === cutoff).length;
        let ways = 1n;
        for (let i = 0; i < bigger; i++) ways = (ways * BigInt(freqs[i])) % MOD;
        ways = (ways * modPow(BigInt(cutoff), BigInt(k - bigger))) % MOD;
        let comb = 1n;
        for (let i = 1; i <= k - bigger; i++) {
            comb = (((comb * BigInt(sameCount - i + 1)) % MOD) * modPow(BigInt(i), MOD - 2n)) % MOD;
        }
        return Number((ways * comb) % MOD);
    }
}
