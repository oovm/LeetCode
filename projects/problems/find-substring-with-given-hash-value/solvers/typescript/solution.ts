export class Solution {
    subStrHash(hashValue: number, modulo: number, power: number, k: number, s: string): string {
        const mod = BigInt(modulo);
        const p = BigInt(power);
        const target = BigInt(hashValue);
        let hash = 0n;
        let pk = 1n;
        let start = s.length - k;
        for (let i = s.length - 1; i >= s.length - k; i--) {
            hash = (hash * p + BigInt(s.charCodeAt(i) - 96)) % mod;
            if (i > s.length - k) pk = (pk * p) % mod;
        }
        if (hash === target) start = s.length - k;
        for (let i = s.length - k - 1; i >= 0; i--) {
            hash = (hash * p + BigInt(s.charCodeAt(i) - 96) - BigInt(s.charCodeAt(i + k) - 96) * ((pk * p) % mod)) % mod;
            hash = ((hash % mod) + mod) % mod;
            if (hash === target) start = i;
        }
        return s.slice(start, start + k);
    }
}
