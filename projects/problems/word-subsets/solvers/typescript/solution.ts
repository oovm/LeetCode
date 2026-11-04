export class Solution {
    wordSubsets(words1: string[], words2: string[]): string[] {
        const maxima = new Map<string, number>();
        for (const word of words2) {
            const need = new Map<string, number>();
            for (const character of word) need.set(character, (need.get(character) ?? 0) + 1);
            for (const [character, count] of need) {
                maxima.set(character, Math.max(maxima.get(character) ?? 0, count));
            }
        }
        return words1.filter((word) => {
            const counts = new Map<string, number>();
            for (const character of word) counts.set(character, (counts.get(character) ?? 0) + 1);
            for (const [character, count] of counts) {
                if ((maxima.get(character) ?? 0) < count) return false;
            }
            return true;
        });
    }
}
