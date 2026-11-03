export class Solution {
    minWindow(s: string, t: string): string {
        const need = new Map<string, number>();
        for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);
        let missing = t.length;
        let best = '';
        let left = 0;
        for (let right = 0; right < s.length; right++) {
            const rc = need.get(s[right]);
            if (rc !== undefined) {
                if (rc > 0) missing -= 1;
                need.set(s[right], rc - 1);
            }
            while (missing === 0) {
                if (best === '' || right - left + 1 < best.length) {
                    best = s.slice(left, right + 1);
                }
                const lc = need.get(s[left]);
                if (lc !== undefined) {
                    if (lc === 0) missing += 1;
                    need.set(s[left], lc + 1);
                }
                left += 1;
            }
        }
        return best;
    }
}
