export class Solution {
    canPermutePalindrome(s: string): boolean {
        let oddMask = 0;
        for (const ch of s) {
            oddMask ^= 1 << (ch.charCodeAt(0) - 97);
        }
        return (oddMask & (oddMask - 1)) === 0;
    }
}
