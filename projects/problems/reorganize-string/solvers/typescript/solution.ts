export class Solution {
    reorganizeString(s: string): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        const order = counts
            .map((c, i) => ({ c, ch: String.fromCharCode(97 + i) }))
            .filter((x) => x.c > 0)
            .sort((a, b) => b.c - a.c);
        if (order[0].c > Math.ceil(s.length / 2)) {
            return '';
        }
        const out = new Array<string>(s.length);
        let pos = 0;
        for (const { c, ch } of order) {
            for (let i = 0; i < c; i++) {
                out[pos] = ch;
                pos = pos + 2 < s.length ? pos + 2 : 1;
            }
        }
        return out.join('');
    }
}
