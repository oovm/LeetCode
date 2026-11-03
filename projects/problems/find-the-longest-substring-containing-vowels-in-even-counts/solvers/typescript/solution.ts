export class Solution {
    findTheLongestSubstring(s: string): number {
        const first = new Array<number>(32).fill(-2);
        first[0] = -1;
        let mask = 0;
        let best = 0;
        for (let i = 0; i < s.length; i++) {
            const idx = 'aeiou'.indexOf(s[i]);
            if (idx !== -1) {
                mask ^= 1 << idx;
            }
            if (first[mask] === -2) {
                first[mask] = i;
            } else {
                best = Math.max(best, i - first[mask]);
            }
        }
        return best;
    }
}
