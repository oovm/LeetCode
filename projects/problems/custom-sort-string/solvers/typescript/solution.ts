export class Solution {
    customSortString(order: string, s: string): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        const out: string[] = [];
        for (const ch of order) {
            const idx = ch.charCodeAt(0) - 97;
            out.push(ch.repeat(counts[idx]));
            counts[idx] = 0;
        }
        for (let i = 0; i < 26; i++) {
            out.push(String.fromCharCode(97 + i).repeat(counts[i]));
        }
        return out.join('');
    }
}
