export class Solution {
    countWords(words1: string[], words2: string[]): number {
        const freq = (words: string[]): Map<string, number> => {
            const m = new Map<string, number>();
            for (const w of words) m.set(w, (m.get(w) ?? 0) + 1);
            return m;
        };
        const a = freq(words1);
        const b = freq(words2);
        let count = 0;
        for (const [w, c] of a) {
            if (c === 1 && b.get(w) === 1) count++;
        }
        return count;
    }
}
