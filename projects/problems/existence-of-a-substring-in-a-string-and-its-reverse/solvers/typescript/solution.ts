export class Solution {
    isSubstringPresent(s: string): boolean {
        for (let i = 0; i + 1 < s.length; i++) {
            const pair = s[i + 1] + s[i];
            if (s.includes(pair)) {
                return true;
            }
        }
        return false;
    }
}
