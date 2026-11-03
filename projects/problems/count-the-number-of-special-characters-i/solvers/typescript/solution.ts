export class Solution {
    numberOfSpecialChars(word: string): number {
        let lower = 0;
        let upper = 0;
        for (const ch of word) {
            const code = ch.charCodeAt(0);
            if (code >= 97) lower |= 1 << (code - 97);
            else upper |= 1 << (code - 65);
        }
        return (lower & upper).toString(2).replaceAll('0', '').length;
    }
}
