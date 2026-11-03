export class Solution {
    calculate(s: string): number {
        const stack: number[] = [];
        let current = 0;
        let sign = '+';
        for (let i = 0; i <= s.length; i++) {
            const ch = s[i];
            if (ch >= '0' && ch <= '9') {
                current = current * 10 + (ch.charCodeAt(0) - 48);
            }
            if (i === s.length || ch === '+' || ch === '-' || ch === '*' || ch === '/') {
                if (sign === '+') stack.push(current);
                else if (sign === '-') stack.push(-current);
                else if (sign === '*') stack.push(stack.pop()! * current);
                else stack.push(Math.trunc(stack.pop()! / current));
                sign = ch;
                current = 0;
            }
        }
        return stack.reduce((a, b) => a + b, 0);
    }
}
