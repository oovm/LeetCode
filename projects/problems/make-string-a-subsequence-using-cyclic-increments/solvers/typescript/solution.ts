export class Solution {
    canMakeSubsequence(str1: string, str2: string): boolean {
        let j = 0;
        for (const ch of str1) {
            if (j < str2.length) {
                const next = String.fromCharCode(97 + ((ch.charCodeAt(0) - 96) % 26));
                if (ch === str2[j] || next === str2[j]) {
                    j += 1;
                }
            }
        }
        return j === str2.length;
    }
}
