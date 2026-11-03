export class Solution {
    hasAllCodes(s: string, k: number): boolean {
        const seen = new Set<string>();
        for (let i = 0; i + k <= s.length; i++) {
            seen.add(s.slice(i, i + k));
        }
        return seen.size >= 2 ** k;
    }
}
