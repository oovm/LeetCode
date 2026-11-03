export class Solution {
    countDistinct(s: string): number {
        const seen = new Set<string>();
        for (let i = 0; i < s.length; i++) {
            for (let j = i + 1; j <= s.length; j++) {
                seen.add(s.slice(i, j));
            }
        }
        return seen.size;
    }
}
