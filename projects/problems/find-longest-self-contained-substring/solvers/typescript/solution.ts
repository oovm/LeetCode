export class Solution {
    maxSubstringLength(s: string): number {
        let best = -1;
        for (let first = 0; first < 26; first++) {
            const ch = String.fromCharCode(97 + first);
            const f = s.indexOf(ch);
            const l = s.lastIndexOf(ch);
            if (f === -1) continue;
            let lo = f;
            let hi = l;
            let ok = true;
            let changed = true;
            while (changed) {
                changed = false;
                for (let i = lo; i <= hi; i++) {
                    const cf = s.indexOf(s[i]);
                    const cl = s.lastIndexOf(s[i]);
                    if (cf < lo) {
                        lo = cf;
                        changed = true;
                    }
                    if (cl > hi) {
                        hi = cl;
                        changed = true;
                    }
                }
            }
            if (lo === 0 && hi === s.length - 1) ok = false;
            if (ok) best = Math.max(best, hi - lo + 1);
        }
        return best;
    }
}
