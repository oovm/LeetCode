export class Solution {
    shortestPalindrome(s: string): string {
        const joined = `${s}#${[...s].reverse().join('')}`;
        const fail = new Array<number>(joined.length).fill(0);
        for (let i = 1, j = 0; i < joined.length; i++) {
            while (j > 0 && joined[i] !== joined[j]) j = fail[j - 1];
            if (joined[i] === joined[j]) j += 1;
            fail[i] = j;
        }
        const prefix = fail[joined.length - 1];
        return [...s.slice(prefix)].reverse().join('') + s;
    }
}
