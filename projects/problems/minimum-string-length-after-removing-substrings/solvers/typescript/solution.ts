export class Solution {
    minLength(s: string): number {
        const stack: string[] = [];
        for (const ch of s) {
            const top = stack[stack.length - 1];
            if ((top === 'A' && ch === 'B') || (top === 'C' && ch === 'D')) {
                stack.pop();
            } else {
                stack.push(ch);
            }
        }
        return stack.length;
    }
}
