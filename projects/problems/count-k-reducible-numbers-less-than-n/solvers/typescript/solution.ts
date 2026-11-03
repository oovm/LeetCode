export class Solution {
    countKReducibleNumbers(s: string, k: number): number {
        const MOD = 1000000007n;
        const steps = (x: number): number => {
            let count = 0;
            while (x !== 1) {
                x = x.toString(2).replaceAll('0', '').length;
                count += 1;
            }
            return count;
        };
        const reducible = new Array<number>(s.length + 1).fill(0);
        for (let c = 1; c <= s.length; c++) {
            reducible[c] = steps(c) + 1 <= k ? 1 : 0;
        }
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
        let total = 0n;
        let ones = 0;
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '0') continue;
            const rest = s.length - 1 - i;
            for (let c = 1; c <= s.length; c++) {
                if (reducible[c] === 0) continue;
                const need = c - ones;
                if (need < 0 || need > rest) continue;
                let comb = 1n;
                for (let j = 1; j <= need; j++) {
                    comb = (((comb * BigInt(rest - j + 1)) % MOD) * modPow(BigInt(j), MOD - 2n)) % MOD;
                }
                total = (total + comb) % MOD;
            }
            ones += 1;
        }
        return Number(total);
    }
}
