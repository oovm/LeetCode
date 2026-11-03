export class Solution {
    removeKdigits(num: string, k: number): number {
        const stack: string[] = [];
        let rest = k;
        for (const ch of num) {
            while (rest > 0 && stack.length > 0 && stack[stack.length - 1] > ch) {
                stack.pop();
                rest -= 1;
            }
            stack.push(ch);
        }
        const text = stack.slice(0, num.length - rest).join('').replace(/^0+/, '');
        return Number(text === '' ? '0' : text);
    }
}
