export class Solution {
    lengthOfLongestSubstringKDistinct(s: string, k: number): number {
        const counts = new Map<string, number>();
        let best = 0;
        let left = 0;
        for (let right = 0; right < s.length; right++) {
            counts.set(s[right], (counts.get(s[right]) ?? 0) + 1);
            while (counts.size > k) {
                const c = counts.get(s[left])! - 1;
                if (c === 0) counts.delete(s[left]);
                else counts.set(s[left], c);
                left += 1;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
