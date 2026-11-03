export class Solution {
    minimumScore(s: string, t: string): number {
        const n = s.length;
        const m = t.length;
        const pre = new Array<number>(m).fill(n);
        let p = 0;
        for (let j = 0; j < m; j++) {
            while (p < n && s[p] !== t[j]) p += 1;
            pre[j] = p;
            p += 1;
        }
        if (pre[m - 1] < n) return 0;
        const suf = new Array<number>(m).fill(-1);
        let i = n - 1;
        for (let j = m - 1; j >= 0; j--) {
            while (i >= 0 && s[i] !== t[j]) i -= 1;
            suf[j] = i;
            i -= 1;
        }
        let best = m;
        let r = 0;
        for (let l = 0; l < m; l++) {
            if (l > 0 && pre[l - 1] === n) break;
            const prePos = l === 0 ? -1 : pre[l - 1];
            if (r < l) r = l;
            while (r + 1 < m && suf[r + 1] <= prePos) r += 1;
            if (r + 1 === m || suf[r + 1] > prePos) {
                best = Math.min(best, r - l + 1);
            }
        }
        return best;
    }
}
