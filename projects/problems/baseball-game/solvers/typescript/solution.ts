export class Solution {
    calPoints(operations: string[]): number {
        const stack: number[] = [];
        const peek = (offset: number): number => {
            if (stack.length < offset) {
                throw new Error('list index out of range');
            }
            return stack[stack.length - offset];
        };
        for (const op of operations) {
            if (op === '+') {
                stack.push(peek(1) + peek(2));
            } else if (op === 'D') {
                stack.push(peek(1) * 2);
            } else if (op === 'C') {
                if (stack.length === 0) {
                    throw new Error('pop from empty list');
                }
                stack.pop();
            } else {
                stack.push(Number(op));
            }
        }
        return stack.reduce((a, b) => a + b, 0);
    }
}
