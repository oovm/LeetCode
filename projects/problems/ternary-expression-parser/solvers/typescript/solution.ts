export class Solution {
    parseTernary(expression: string): string {
        const stack: string[] = [];
        let i = expression.length - 1;
        while (i >= 0) {
            const ch = expression[i];
            if (ch === ':') {
                i -= 1;
            } else if (ch === '?') {
                const condition = expression[i - 1];
                const thenValue = stack.pop()!;
                const elseValue = stack.pop()!;
                stack.push(condition === 'T' ? thenValue : elseValue);
                i -= 2;
            } else {
                stack.push(ch);
                i -= 1;
            }
        }
        return stack[0];
    }
}
