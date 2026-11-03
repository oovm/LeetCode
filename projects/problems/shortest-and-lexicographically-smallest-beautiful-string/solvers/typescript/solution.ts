export class Solution {
    shortestBeautifulSubstring(s: string, k: number): string {
        let best = '';
        for (let i = 0; i < s.length; i++) {
            let ones = 0;
            for (let j = i; j < s.length; j++) {
                if (s[j] === '1') ones += 1;
                if (ones === k) {
                    const sub = s.slice(i, j + 1);
                    if (best === '' || sub.length < best.length || (sub.length === best.length && sub < best)) {
                        best = sub;
                    }
                    break;
                }
            }
        }
        return best;
    }
}
