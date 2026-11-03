export class Solution {
    countBalancedPermutations(num: string): number {
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
        const n = num.length;
        const counts = new Array<number>(10).fill(0);
        let totalSum = 0;
        for (const ch of num) {
            const d = ch.charCodeAt(0) - 48;
            counts[d] += 1;
            totalSum += d;
        }
        if (totalSum % 2 === 1) return 0;
        const target = totalSum / 2;
        const evenSlots = Math.ceil(n / 2);
        const fact = new Array<bigint>(n + 1).fill(1n);
        for (let i = 1; i <= n; i++) fact[i] = (fact[i - 1] * BigInt(i)) % MOD;
        const comb = (a: number, b: number): bigint =>
            b < 0 || b > a ? 0n : (((fact[a] * modPow(fact[b], MOD - 2n)) % MOD) * modPow(fact[a - b], MOD - 2n)) % MOD;
        let dp = new Map<string, bigint>([['0,0', 1n]]);
        for (let d = 0; d < 10; d++) {
            const next = new Map<string, bigint>();
            for (const [key, ways] of dp) {
                const [sum, cnt] = key.split(',').map(Number);
                for (let take = 0; take <= counts[d]; take++) {
                    const ns = sum + take * d;
                    const nc = cnt + take;
                    if (ns > target || nc > evenSlots) break;
                    const w = (ways * comb(evenSlots - cnt, take)) % MOD;
                    const nkey = `${ns},${nc}`;
                    next.set(nkey, ((next.get(nkey) ?? 0n) + w) % MOD);
                }
            }
            dp = next;
        }
        const total = dp.get(`${target},${evenSlots}`) ?? 0n;
        return Number((((total * fact[evenSlots]) % MOD) * fact[n - evenSlots]) % MOD);
    }
}
