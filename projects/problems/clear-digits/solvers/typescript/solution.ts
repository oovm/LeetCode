export class Solution {
    clearDigits(s: string): string {
        const stack: string[] = [];
        for (const ch of s) {
            if (ch >= '0' && ch <= '9') {
                stack.pop();
            } else {
                stack.push(ch);
            }
        }
        return stack.join('');
    }
}
