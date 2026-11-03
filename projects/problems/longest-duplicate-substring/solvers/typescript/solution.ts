export class Solution {
    longestDupSubstring(s: string): string {
        const n = s.length;
        const BASE = 131n;
        const MOD = 2n ** 64n;
        const check = (len: number): number => {
            let hash = 0n;
            let power = 1n;
            for (let i = 0; i < len; i++) {
                hash = (hash * BASE + BigInt(s.charCodeAt(i))) % MOD;
                power = (power * BASE) % MOD;
            }
            const seen = new Map<bigint, number[]>([[hash, [0]]]);
            for (let i = len; i < n; i++) {
                hash = (hash * BASE - BigInt(s.charCodeAt(i - len)) * power + BigInt(s.charCodeAt(i))) % MOD;
                hash = (hash + MOD) % MOD;
                const list = seen.get(hash);
                if (list) {
                    for (const start of list) {
                        if (s.slice(start, start + len) === s.slice(i - len + 1, i + 1)) {
                            return i - len + 1;
                        }
                    }
                    list.push(i - len + 1);
                } else {
                    seen.set(hash, [i - len + 1]);
                }
            }
            return -1;
        };
        let lo = 0;
        let hi = n - 1;
        let answer = '';
        while (lo <= hi) {
            const mid = Math.floor((lo + hi) / 2);
            const idx = check(mid);
            if (idx !== -1) {
                answer = s.slice(idx, idx + mid);
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return answer;
    }
}
