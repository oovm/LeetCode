export class Solution {
    removePalindromeSub(s: string): number {
        const isPalindrome = [...s].every((ch, i) => ch === s[s.length - 1 - i]);
        return isPalindrome ? 1 : 2;
    }
}
