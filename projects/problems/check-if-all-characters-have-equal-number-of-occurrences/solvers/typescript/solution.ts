export class Solution {
    areOccurrencesEqual(s: string): boolean {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        const target = counts.find((c) => c > 0);
        return counts.every((c) => c === 0 || c === target);
    }
}
