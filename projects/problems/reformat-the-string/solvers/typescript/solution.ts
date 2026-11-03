export class Solution {
    reformat(s: string): string {
        const letters = [...s].filter((c) => c >= 'a' && c <= 'z');
        const digits = [...s].filter((c) => c >= '0' && c <= '9');
        if (Math.abs(letters.length - digits.length) > 1) {
            return '';
        }
        const [first, second] = letters.length >= digits.length ? [letters, digits] : [digits, letters];
        const out: string[] = [];
        for (let i = 0; i < s.length; i++) {
            out.push(i % 2 === 0 ? first[i / 2] : second[(i - 1) / 2]);
        }
        return out.join('');
    }
}
