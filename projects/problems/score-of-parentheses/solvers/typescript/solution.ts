export class Solution {
    scoreOfParentheses(s: string): number {
        let depth = 0;
        let score = 0;
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '(') {
                depth += 1;
            } else {
                depth -= 1;
                if (s[i - 1] === '(') {
                    score += 1 << depth;
                }
            }
        }
        return score;
    }
}
