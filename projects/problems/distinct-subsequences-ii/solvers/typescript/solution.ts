export class Solution {
    distinctSubseqII(s: string): number {
        const MOD = 1000000007;
        const last = new Array<number>(26).fill(0);
        let total = 1;
        for (const ch of s) {
            const c = ch.charCodeAt(0) - 97;
            const add = ((total - last[c]) % MOD + MOD) % MOD;
            last[c] = total;
            total = (total + add) % MOD;
        }
        return (total - 1 + MOD) % MOD;
    }
}
