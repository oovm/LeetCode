export class Solution {
    countPalindromicSubsequence(s: string): number {
        const first = new Array<number>(26).fill(-1);
        const last = new Array<number>(26).fill(-1);
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i) - 97;
            if (first[c] === -1) first[c] = i;
            last[c] = i;
        }
        let total = 0;
        for (let c = 0; c < 26; c++) {
            if (first[c] !== -1 && last[c] - first[c] >= 2) {
                total += new Set(s.slice(first[c] + 1, last[c])).size;
            }
        }
        return total;
    }
}
