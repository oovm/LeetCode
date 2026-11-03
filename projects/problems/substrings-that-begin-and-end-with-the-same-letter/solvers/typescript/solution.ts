export class Solution {
    numberOfSubstrings(s: string): number {
        const counts = new Array<number>(26).fill(0);
        let total = 0;
        for (const ch of s) {
            const c = ch.charCodeAt(0) - 97;
            counts[c] += 1;
            total += counts[c];
        }
        return total;
    }
}
