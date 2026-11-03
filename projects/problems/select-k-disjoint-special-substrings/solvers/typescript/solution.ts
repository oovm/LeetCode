export class Solution {
    maxSubstringLength(s: string, k: number): boolean {
        if (k === 0) {
            return true;
        }
        const intervals: [number, number][] = [];
        for (let c = 0; c < 26; c++) {
            const ch = String.fromCharCode(97 + c);
            const first = s.indexOf(ch);
            const last = s.lastIndexOf(ch);
            if (first === -1) continue;
            let lo = first;
            let hi = last;
            let changed = true;
            while (changed) {
                changed = false;
                for (let i = lo; i <= hi; i++) {
                    const f = s.indexOf(s[i]);
                    const l = s.lastIndexOf(s[i]);
                    if (f < lo) {
                        lo = f;
                        changed = true;
                    }
                    if (l > hi) {
                        hi = l;
                        changed = true;
                    }
                }
            }
            if (!(lo === 0 && hi === s.length - 1)) {
                intervals.push([lo, hi]);
            }
        }
        intervals.sort((a, b) => a[1] - b[1]);
        let taken = 0;
        let end = -1;
        for (const [lo, hi] of intervals) {
            if (lo > end) {
                taken += 1;
                end = hi;
            }
        }
        return taken >= k;
    }
}
