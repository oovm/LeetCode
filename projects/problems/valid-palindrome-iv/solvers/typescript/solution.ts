export class Solution {
    makePalindrome(s: string): boolean {
        let diff = 0;
        for (let i = 0; i < Math.floor(s.length / 2); i++) {
            if (s[i] !== s[s.length - 1 - i]) {
                diff += 1;
            }
        }
        return diff <= 2;
    }
}
