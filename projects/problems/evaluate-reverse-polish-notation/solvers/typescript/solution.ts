export class Solution {
    evalRPN(tokens: string[]): number {
        const stack: number[] = [];
        for (const t of tokens) {
            if ("+-*/".includes(t)) {
                const b = stack.pop()!;
                const a = stack.pop()!;
                stack.push(
                    t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : Math.trunc(a / b),
                );
            } else {
                stack.push(Number(t));
            }
        }
        return stack[0];
    }
}
