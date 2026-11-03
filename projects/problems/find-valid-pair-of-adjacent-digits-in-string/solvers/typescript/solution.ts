export class Solution {
    findValidPair(s: string): string {
        const counts = new Array<number>(10).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 48] += 1;
        }
        for (let d = 1; d < 10; d++) {
            if (counts[d] !== d) {
                counts[d] = -1;
            }
        }
        for (let i = 0; i + 1 < s.length; i++) {
            const a = s.charCodeAt(i) - 48;
            const b = s.charCodeAt(i + 1) - 48;
            if (a !== b && counts[a] === a && counts[b] === b) {
                return s.slice(i, i + 2);
            }
        }
        return '';
    }
}
