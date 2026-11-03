export class Solution {
    nearestPalindromic(n: string): string {
        const len = n.length;
        const value = BigInt(n);
        const candidates = new Set<bigint>([10n ** BigInt(len - 1) - 1n, 10n ** BigInt(len) + 1n]);
        const half = n.slice(0, Math.ceil(len / 2));
        for (const delta of [-1n, 0n, 1n]) {
            const h = (BigInt(half) + delta).toString();
            const pal =
                len % 2 === 0
                    ? h + [...h].reverse().join('')
                    : h + [...h.slice(0, -1)].reverse().join('');
            candidates.add(BigInt(pal));
        }
        candidates.delete(value);
        let best: bigint | null = null;
        for (const c of candidates) {
            const diff = c > value ? c - value : value - c;
            const bestDiff = best === null ? null : best > value ? best - value : value - best;
            if (bestDiff === null || diff < bestDiff || (diff === bestDiff && c < best!)) {
                best = c;
            }
        }
        return best!.toString();
    }
}
