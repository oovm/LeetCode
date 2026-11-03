export class Solution {
    isValid(s: string): boolean {
        const stack: string[] = [];
        for (const ch of s) {
            if (ch === 'c') {
                if (stack.pop() !== 'b' || stack.pop() !== 'a') {
                    return false;
                }
            } else {
                stack.push(ch);
            }
        }
        return stack.length === 0;
    }
}
