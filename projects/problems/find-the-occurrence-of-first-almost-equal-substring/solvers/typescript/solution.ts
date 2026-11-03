export class Solution {
    minStartingIndex(s: string, pattern: string): number {
        for (let i = 0; i + pattern.length <= s.length; i++) {
            let diff = 0;
            for (let j = 0; j < pattern.length; j++) {
                if (s[i + j] !== pattern[j]) {
                    diff += 1;
                    if (diff > 1) break;
                }
            }
            if (diff <= 1) return i;
        }
        return -1;
    }
}
