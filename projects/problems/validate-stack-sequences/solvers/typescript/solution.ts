export class Solution {
    validateStackSequences(pushed: number[], popped: number[]): boolean {
        const stack: number[] = [];
        let cursor = 0;
        for (const value of pushed) {
            stack.push(value);
            while (stack.length > 0 && cursor < popped.length && stack[stack.length - 1] === popped[cursor]) {
                stack.pop();
                cursor++;
            }
        }
        return stack.length === 0;
    }
}
