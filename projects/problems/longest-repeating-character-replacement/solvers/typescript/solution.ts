export class Solution {
    characterReplacement(s: string, k: number): number {
        const counts = new Array<number>(26).fill(0);
        let maxFreq = 0;
        let best = 0;
        let left = 0;
        for (let right = 0; right < s.length; right++) {
            maxFreq = Math.max(maxFreq, (counts[s.charCodeAt(right) - 65] += 1));
            while (right - left + 1 - maxFreq > k) {
                counts[s.charCodeAt(left) - 65] -= 1;
                left += 1;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
