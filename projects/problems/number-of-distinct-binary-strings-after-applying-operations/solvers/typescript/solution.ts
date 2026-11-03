export class Solution {
    countDistinctStrings(s: string, k: number): number {
        const seen = new Set<string>();
        for (let i = 0; i + k <= s.length; i++) {
            seen.add(s.slice(i, i + k));
        }
        return seen.size;
    }
}
