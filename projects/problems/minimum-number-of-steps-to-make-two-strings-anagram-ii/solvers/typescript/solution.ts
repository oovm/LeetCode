export class Solution {
    minSteps(s: string, t: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        for (const ch of t) counts[ch.charCodeAt(0) - 97] -= 1;
        return counts.reduce((sum, c) => sum + Math.abs(c), 0);
    }
}
