export class Solution {
    makeSmallestPalindrome(s: string): string {
        const chars = s.split('');
        for (let i = 0; i < Math.floor(chars.length / 2); i++) {
            const j = chars.length - 1 - i;
            const smaller = chars[i] < chars[j] ? chars[i] : chars[j];
            chars[i] = smaller;
            chars[j] = smaller;
        }
        return chars.join('');
    }
}
