export class Solution {
    longestCommonPrefix(s: string, t: string): number {
        let i = 0;
        let j = 0;
        let skipped = false;
        while (i < s.length && j < t.length) {
            if (s[i] === t[j]) {
                i += 1;
                j += 1;
            } else if (!skipped) {
                skipped = true;
                i += 1;
            } else {
                break;
            }
        }
        return j;
    }
}
