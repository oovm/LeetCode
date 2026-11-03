export class Solution {
    appendCharacters(s: string, t: string): number {
        let j = 0;
        for (const ch of s) {
            if (j < t.length && ch === t[j]) {
                j += 1;
            }
        }
        return t.length - j;
    }
}
