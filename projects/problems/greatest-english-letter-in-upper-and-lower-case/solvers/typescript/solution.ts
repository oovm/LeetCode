export class Solution {
    greatestLetter(s: string): string {
        let lower = 0;
        let upper = 0;
        for (const ch of s) {
            const code = ch.charCodeAt(0);
            if (code >= 97) lower |= 1 << (code - 97);
            else upper |= 1 << (code - 65);
        }
        const both = lower & upper;
        return both === 0 ? '' : String.fromCharCode(65 + 31 - Math.clz32(both));
    }
}
