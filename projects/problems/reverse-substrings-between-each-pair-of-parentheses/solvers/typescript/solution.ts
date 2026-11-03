export class Solution {
    reverseParentheses(s: string): string {
        const stack: string[] = [];
        let current: string[] = [];
        for (const ch of s) {
            if (ch === '(') {
                stack.push(current.join(''));
                current = [];
            } else if (ch === ')') {
                current = [...(stack.pop() ?? ''), ...current.reverse()];
            } else {
                current.push(ch);
            }
        }
        return current.join('');
    }
}
