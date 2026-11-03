export class Solution {
    balancedString(s: string): number {
        const target = s.length / 4;
        const counts: Record<string, number> = { Q: 0, W: 0, E: 0, R: 0 };
        for (const ch of s) {
            counts[ch] += 1;
        }
        let best = s.length;
        let left = 0;
        for (let right = 0; right < s.length; right++) {
            counts[s[right]] -= 1;
            while (
                left <= right &&
                counts.Q <= target &&
                counts.W <= target &&
                counts.E <= target &&
                counts.R <= target
            ) {
                best = Math.min(best, right - left + 1);
                counts[s[left]] += 1;
                left += 1;
            }
        }
        return best;
    }
}
