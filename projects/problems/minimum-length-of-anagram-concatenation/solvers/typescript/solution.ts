export class Solution {
    minAnagramLength(s: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        const n = s.length;
        for (let parts = 1; parts <= n; parts++) {
            if (n % parts !== 0) continue;
            const len = n / parts;
            if (counts.every((c) => c % parts === 0)) {
                const unit = counts.map((c) => c / parts);
                let ok = true;
                for (let p = 0; p < parts && ok; p++) {
                    const seg = new Array<number>(26).fill(0);
                    for (let i = p * len; i < (p + 1) * len; i++) {
                        seg[s.charCodeAt(i) - 97] += 1;
                    }
                    ok = seg.every((c, i) => c === unit[i]);
                }
                if (ok) return len;
            }
        }
        return n;
    }
}
