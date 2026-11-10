export class Solution {
    clumsy(n: number): number {
        const stack: number[] = [n];
        let op = 0;
        for (let i = n - 1; i >= 1; i--) {
            if (op === 0) {
                stack.push(stack.pop()! * i);
            } else if (op === 1) {
                stack.push(Math.trunc(stack.pop()! / i));
            } else if (op === 2) {
                stack.push(i);
            } else {
                stack.push(-i);
            }
            op = (op + 1) % 4;
        }
        return stack.reduce((a, b) => a + b, 0);
    }
}
