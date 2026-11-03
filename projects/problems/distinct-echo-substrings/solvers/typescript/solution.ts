export class Solution {
    distinctEchoSubstrings(text: string): number {
        const seen = new Set<string>();
        for (let len = 1; len <= text.length / 2; len++) {
            for (let i = 0; i + 2 * len <= text.length; i++) {
                if (text.slice(i, i + len) === text.slice(i + len, i + 2 * len)) {
                    seen.add(text.slice(i, i + len));
                }
            }
        }
        return seen.size;
    }
}
