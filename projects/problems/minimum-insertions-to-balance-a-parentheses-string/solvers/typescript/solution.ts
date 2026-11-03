export class Solution {
    minInsertions(s: string): number {
        let insertions = 0;
        let open = 0;
        let i = 0;
        while (i < s.length) {
            if (s[i] === '(') {
                open += 1;
                i += 1;
            } else {
                const pair = i + 1 < s.length && s[i + 1] === ')';
                if (open > 0) {
                    open -= 1;
                } else {
                    insertions += 1;
                }
                if (!pair) {
                    insertions += 1;
                }
                i += pair ? 2 : 1;
            }
        }
        return insertions + open * 2;
    }
}
