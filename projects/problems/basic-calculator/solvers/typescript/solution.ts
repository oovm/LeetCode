export class Solution {
    calculate(s: string): number {
        let result = 0;
        let sign = 1;
        const stack: number[] = [];
        let i = 0;
        while (i < s.length) {
            const ch = s[i];
            if (ch >= '0' && ch <= '9') {
                let value = 0;
                while (i < s.length && s[i] >= '0' && s[i] <= '9') {
                    value = value * 10 + (s.charCodeAt(i) - 48);
                    i += 1;
                }
                result += sign * value;
                continue;
            }
            if (ch === '+') sign = 1;
            else if (ch === '-') sign = -1;
            else if (ch === '(') {
                stack.push(result, sign);
                result = 0;
                sign = 1;
            } else if (ch === ')') {
                const prevSign = stack.pop()!;
                const prevResult = stack.pop()!;
                result = prevResult + prevSign * result;
            }
            i += 1;
        }
        return result;
    }
}
