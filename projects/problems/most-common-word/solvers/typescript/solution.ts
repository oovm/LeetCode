export class Solution {
    mostCommonWord(paragraph: string, banned: string[]): string {
        const bannedSet = new Set(banned.map((word) => word.toLowerCase()));
        const counts = new Map<string, number>();
        let best = "";
        let bestCount = 0;
        for (const word of paragraph.toLowerCase().split(/[^a-z]+/)) {
            if (word.length === 0 || bannedSet.has(word)) {
                continue;
            }
            const count = (counts.get(word) ?? 0) + 1;
            counts.set(word, count);
            if (count > bestCount) {
                bestCount = count;
                best = word;
            }
        }
        return best;
    }
}
