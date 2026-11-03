export class Solution {
    lastSubstring(s: string): string {
        let i = 0;
        let j = 1;
        let offset = 0;
        while (j + offset < s.length) {
            const a = s[i + offset];
            const b = s[j + offset];
            if (a === b) {
                offset += 1;
            } else if (a > b) {
                j = j + offset + 1;
                offset = 0;
            } else {
                i = Math.max(i + offset + 1, j);
                j = i + 1;
                offset = 0;
            }
        }
        return s.slice(i);
    }
}
