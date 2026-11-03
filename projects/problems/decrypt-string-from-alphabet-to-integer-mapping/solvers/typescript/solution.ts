export class Solution {
    freqAlphabets(s: string): string {
        const out: string[] = [];
        let i = s.length - 1;
        while (i >= 0) {
            if (s[i] === '#') {
                out.push(String.fromCharCode(96 + Number(s.slice(i - 2, i))));
                i -= 3;
            } else {
                out.push(String.fromCharCode(96 + Number(s[i])));
                i -= 1;
            }
        }
        return out.reverse().join('');
    }
}
