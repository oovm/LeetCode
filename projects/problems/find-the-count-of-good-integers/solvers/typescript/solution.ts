export class Solution {
    countGoodIntegers(n: number, k: number): number {
        const fact: bigint[] = [1n];
        for (let i = 1; i <= n; i++) {
            fact.push(fact[i - 1] * BigInt(i));
        }
        const halfLen = Math.floor((n + 1) / 2);
        const start = 10 ** (halfLen - 1);
        const seen = new Set<string>();
        let total = 0n;
        for (let half = start; half < start * 10; half++) {
            const hs = String(half);
            const pal = n % 2 === 1 ? hs + [...hs.slice(0, -1)].reverse().join('') : hs + [...hs].reverse().join('');
            if (BigInt(pal) % BigInt(k) !== 0n) {
                continue;
            }
            const counts = new Array<number>(10).fill(0);
            for (const ch of pal) {
                counts[ch.charCodeAt(0) - 48] += 1;
            }
            const signature = counts.join(',');
            if (seen.has(signature)) {
                continue;
            }
            seen.add(signature);
            let perms = fact[n];
            for (const c of counts) {
                perms /= fact[c];
            }
            if (counts[0] > 0) {
                let lead = fact[n - 1];
                lead /= fact[counts[0] - 1];
                for (let d = 1; d < 10; d++) {
                    lead /= fact[counts[d]];
                }
                perms -= lead;
            }
            total += perms;
        }
        return Number(total);
    }
}
