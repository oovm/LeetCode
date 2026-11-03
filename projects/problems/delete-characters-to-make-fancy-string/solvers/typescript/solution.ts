export class Solution {
    makeFancyString(s: string): string {
        const out: string[] = [];
        for (const ch of s) {
            const n = out.length;
            if (n >= 2 && out[n - 1] === ch && out[n - 2] === ch) {
                continue;
            }
            out.push(ch);
        }
        return out.join('');
    }
}
