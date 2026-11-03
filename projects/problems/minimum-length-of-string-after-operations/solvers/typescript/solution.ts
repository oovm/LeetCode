export class Solution {
    minimumLength(s: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        return counts.reduce((sum, c) => sum + (c === 0 ? 0 : c % 2 === 1 ? 1 : 2), 0);
    }
}
