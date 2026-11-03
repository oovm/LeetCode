export class Solution {
    maximumValue(strs: string[]): number {
        let best = 0;
        for (const s of strs) {
            best = Math.max(best, /^\d+$/.test(s) ? Number(s) : s.length);
        }
        return best;
    }
}
