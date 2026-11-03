export class Solution {
    partitionString(s: string): number {
        let seen = 0;
        let parts = 1;
        for (const ch of s) {
            const bit = 1 << (ch.charCodeAt(0) - 97);
            if (seen & bit) {
                parts += 1;
                seen = 0;
            }
            seen |= bit;
        }
        return parts;
    }
}
