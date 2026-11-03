export class Solution {
    maximumGain(x: number, s: string, y: number): number {
        const remove = (text: string, first: string, points: number): [string, number] => {
            const stack: string[] = [];
            let gained = 0;
            for (const ch of text) {
                if (stack.length > 0 && stack[stack.length - 1] === first && ch === (first === 'a' ? 'b' : 'a')) {
                    stack.pop();
                    gained += points;
                } else {
                    stack.push(ch);
                }
            }
            return [stack.join(''), gained];
        };
        const hi = x >= y ? 'a' : 'b';
        const lo = x >= y ? 'b' : 'a';
        const [rest1, gain1] = remove(s, hi, Math.max(x, y));
        const [, gain2] = remove(rest1, lo, Math.min(x, y));
        return gain1 + gain2;
    }
}
