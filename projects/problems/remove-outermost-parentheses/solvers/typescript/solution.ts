export class Solution {
    removeOuterParentheses(s: string): string {
        let out = "";
        let depth = 0;
        for (let i = 0; i < s.length; i += 1) {
            if (s.charCodeAt(i) === 40) {
                if (depth > 0) {
                    out += s[i];
                }
                depth += 1;
            } else {
                depth -= 1;
                if (depth > 0) {
                    out += s[i];
                }
            }
        }
        return out;
    }
}
