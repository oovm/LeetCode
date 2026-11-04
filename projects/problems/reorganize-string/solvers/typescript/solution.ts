export class Solution {
    reorganizeString(s: string): string {
        const counts = new Array<number>(26).fill(0);
        const first = new Array<number>(26).fill(-1);
        for (let pos = 0; pos < s.length; pos++) {
            const code = s.charCodeAt(pos) - 97;
            counts[code] += 1;
            if (first[code] < 0) first[code] = pos;
        }
        // 与 Python Counter.most_common() 一致：次数降序，同次数按首次出现顺序。
        const order = counts
            .map((c, i) => ({ c, i }))
            .filter((x) => x.c > 0)
            .sort((a, b) => b.c - a.c || first[a.i] - first[b.i]);
        if (order[0].c > Math.ceil(s.length / 2)) {
            return '';
        }
        const out = new Array<string>(s.length);
        let index = 0;
        for (const { c, i } of order) {
            for (let n = 0; n < c; n++) {
                out[index] = String.fromCharCode(97 + i);
                index = index + 2 < s.length ? index + 2 : 1;
            }
        }
        return out.join('');
    }
}
