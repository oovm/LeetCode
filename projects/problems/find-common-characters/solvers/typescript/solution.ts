export class Solution {
    commonChars(words: string[]): string[] {
        const freq = (w: string): number[] => {
            const f = new Array(26).fill(0);
            for (const c of w) f[c.charCodeAt(0) - 97]++;
            return f;
        };
        const common = freq(words[0]);
        for (let i = 1; i < words.length; i++) {
            const f = freq(words[i]);
            for (let j = 0; j < 26; j++) {
                common[j] = Math.min(common[j], f[j]);
            }
        }
        const out: string[] = [];
        for (let j = 0; j < 26; j++) {
            for (let k = 0; k < common[j]; k++) {
                out.push(String.fromCharCode(97 + j));
            }
        }
        return out;
    }
}
