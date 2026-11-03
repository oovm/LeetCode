export class Solution {
    robotWithString(s: string): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        const stack: string[] = [];
        const out: string[] = [];
        let min = 0;
        for (const ch of s) {
            stack.push(ch);
            counts[ch.charCodeAt(0) - 97] -= 1;
            while (min < 25 && counts[min] === 0) min += 1;
            while (stack.length > 0 && stack[stack.length - 1].charCodeAt(0) - 97 <= min) {
                out.push(stack.pop()!);
            }
        }
        return out.join('');
    }
}
