export class Solution {
    sortString(s: string): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        const out: string[] = [];
        while (out.length < s.length) {
            for (let i = 0; i < 26; i++) {
                if (counts[i] > 0) {
                    out.push(String.fromCharCode(97 + i));
                    counts[i] -= 1;
                }
            }
            for (let i = 25; i >= 0; i--) {
                if (counts[i] > 0) {
                    out.push(String.fromCharCode(97 + i));
                    counts[i] -= 1;
                }
            }
        }
        return out.join('');
    }
}
