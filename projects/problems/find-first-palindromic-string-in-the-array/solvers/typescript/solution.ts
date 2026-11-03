export class Solution {
    firstPalindrome(words: string[]): string {
        for (const word of words) {
            if (word === [...word].reverse().join("")) return word;
        }
        return "";
    }
}
