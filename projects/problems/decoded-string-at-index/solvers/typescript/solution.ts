export class Solution {
    decodeAtIndex(s: string, k: number): string {
        let size = 0;
        for (const ch of s) {
            size = ch >= '2' && ch <= '9' ? size * Number(ch) : size + 1;
        }
        let rest = k;
        for (let i = s.length - 1; i >= 0; i--) {
            const ch = s[i];
            rest %= size;
            if (rest === 0 && !(ch >= '2' && ch <= '9')) {
                return ch;
            }
            size = ch >= '2' && ch <= '9' ? size / Number(ch) : size - 1;
        }
        return '';
    }
}
