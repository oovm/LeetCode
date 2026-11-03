export class Solution {
    longestPalindrome(s: string): number {
        const counts = new Map<string, number>();
        for (const ch of s) {
            counts.set(ch, (counts.get(ch) ?? 0) + 1);
        }
        let length = 0;
        let hasOdd = false;
        for (const c of counts.values()) {
            length += c - (c % 2);
            if (c % 2 === 1) {
                hasOdd = true;
            }
        }
        return hasOdd ? length + 1 : length;
    }
}
