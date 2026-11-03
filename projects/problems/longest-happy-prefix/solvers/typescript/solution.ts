export class Solution {
    longestPrefix(s: string): string {
        const fail = new Array<number>(s.length).fill(0);
        for (let i = 1, j = 0; i < s.length; i++) {
            while (j > 0 && s[i] !== s[j]) j = fail[j - 1];
            if (s[i] === s[j]) j += 1;
            fail[i] = j;
        }
        return s.slice(0, fail[s.length - 1]);
    }
}
