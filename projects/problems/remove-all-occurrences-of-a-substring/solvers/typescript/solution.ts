export class Solution {
    removeOccurrences(s: string, part: string): string {
        const stack: string[] = [];
        const m = part.length;
        for (const ch of s) {
            stack.push(ch);
            if (stack.length >= m && stack.slice(-m).join('') === part) {
                stack.length -= m;
            }
        }
        return stack.join('');
    }
}
