export class Solution {
    hasMatch(s: string, p: string): boolean {
        let cursor = 0;
        let i = 0;
        while (i < p.length) {
            let j = i;
            while (j < p.length && p[j] !== '*') j += 1;
            if (j > i) {
                const found = s.indexOf(p.slice(i, j), cursor);
                if (found === -1) return false;
                cursor = found + (j - i);
            }
            i = j + 1;
        }
        return true;
    }
}
