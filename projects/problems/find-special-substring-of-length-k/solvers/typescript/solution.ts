export class Solution {
    hasSpecialSubstring(s: string, k: number): boolean {
        let run = 1;
        for (let i = 1; i <= s.length; i++) {
            if (i < s.length && s[i] === s[i - 1]) {
                run += 1;
            } else {
                if (run === k) {
                    return true;
                }
                run = 1;
            }
        }
        return false;
    }
}
