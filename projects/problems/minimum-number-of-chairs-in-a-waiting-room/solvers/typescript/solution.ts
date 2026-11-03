export class Solution {
    minimumChairs(s: string): number {
        let current = 0;
        let best = 0;
        for (const ch of s) {
            current += ch === 'E' ? 1 : -1;
            best = Math.max(best, current);
        }
        return best;
    }
}
