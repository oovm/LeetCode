export class Solution {
    generateParenthesis(n: number): string[] {
        const results: string[] = [];
        const expand = (open: number, close: number, current: string): void => {
            if (current.length === 2 * n) {
                results.push(current);
                return;
            }
            if (open < n) {
                expand(open + 1, close, current + "(");
            }
            if (close < open) {
                expand(open, close + 1, current + ")");
            }
        };
        expand(0, 0, "");
        return results;
    }
}
