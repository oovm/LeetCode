export class Solution {
    repeatedCharacter(s: string): string {
        const seen = new Set<string>();
        for (const ch of s) {
            if (seen.has(ch)) {
                return ch;
            }
            seen.add(ch);
        }
        return '';
    }
}
