export class Solution {
    removeDuplicateLetters(s: string): string {
        const last = new Array<number>(26).fill(-1);
        for (let i = 0; i < s.length; i++) {
            last[s.charCodeAt(i) - 97] = i;
        }
        const stack: string[] = [];
        const inStack = new Array<boolean>(26).fill(false);
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i) - 97;
            if (inStack[c]) continue;
            while (
                stack.length > 0 &&
                stack[stack.length - 1].charCodeAt(0) - 97 > c &&
                last[stack[stack.length - 1].charCodeAt(0) - 97] > i
            ) {
                inStack[stack.pop()!.charCodeAt(0) - 97] = false;
            }
            stack.push(s[i]);
            inStack[c] = true;
        }
        return stack.join('');
    }
}
