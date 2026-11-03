export class Solution {
    maxPartitionsAfterOperations(s: string, k: number): number {
        const n = s.length;
        const popcount = (x: number): number => x.toString(2).replaceAll('0', '').length;
        const pre: { parts: number; mask: number }[] = new Array(n + 1).fill({ parts: 0, mask: 0 });
        let parts = 1;
        let mask = 0;
        for (let i = 0; i < n; i++) {
            const bit = 1 << (s.charCodeAt(i) - 97);
            if (popcount(mask | bit) > k) {
                parts += 1;
                mask = 0;
            }
            mask |= bit;
            pre[i + 1] = { parts, mask };
        }
        const suf: { parts: number; mask: number }[] = new Array(n + 1).fill({ parts: 0, mask: 0 });
        parts = 1;
        mask = 0;
        for (let i = n - 1; i >= 0; i--) {
            const bit = 1 << (s.charCodeAt(i) - 97);
            if (popcount(mask | bit) > k) {
                parts += 1;
                mask = 0;
            }
            mask |= bit;
            suf[i] = { parts, mask };
        }
        let best = 1;
        for (let i = 0; i < n; i++) {
            for (let c = 0; c < 26; c++) {
                const l = pre[i];
                const r = suf[i + 1];
                const union = l.mask | r.mask | (1 << c);
                const pc = popcount(union);
                let candidate: number;
                if (pc <= k) {
                    candidate = l.parts + r.parts - 1;
                } else if (popcount(l.mask) === k && popcount(r.mask) === k) {
                    candidate = l.parts + r.parts + 1;
                } else {
                    candidate = l.parts + r.parts;
                }
                best = Math.max(best, candidate);
            }
        }
        return best;
    }
}
