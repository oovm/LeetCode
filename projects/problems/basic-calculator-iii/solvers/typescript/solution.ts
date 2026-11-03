export class Solution {
    calculate(s: string): number {
        const nums: number[] = [];
        const ops: string[] = [];
        const precedence = (op: string): number => (op === '+' || op === '-' ? 1 : 2);
        const apply = (): void => {
            const b = nums.pop()!;
            const a = nums.pop()!;
            const op = ops.pop()!;
            nums.push(
                op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : Math.trunc(a / b),
            );
        };
        let i = 0;
        while (i < s.length) {
            const ch = s[i];
            if (ch >= '0' && ch <= '9') {
                let value = 0;
                while (i < s.length && s[i] >= '0' && s[i] <= '9') {
                    value = value * 10 + (s.charCodeAt(i) - 48);
                    i += 1;
                }
                nums.push(value);
                continue;
            }
            if (ch === '(') ops.push(ch);
            else if (ch === ')') {
                while (ops[ops.length - 1] !== '(') apply();
                ops.pop();
            } else if (ch !== ' ') {
                while (
                    ops.length > 0 &&
                    ops[ops.length - 1] !== '(' &&
                    precedence(ops[ops.length - 1]) >= precedence(ch)
                ) {
                    apply();
                }
                ops.push(ch);
            }
            i += 1;
        }
        while (ops.length > 0) apply();
        return nums[0];
    }
}
