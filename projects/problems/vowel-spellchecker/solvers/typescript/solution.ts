export class Solution {
    spellchecker(wordlist: string[], queries: string[]): string[] {
        const exact = new Set(wordlist);
        const lowered = new Map<string, string>();
        const pattern = new Map<string, string>();
        const vowelize = (word: string) => word.replace(/[aeiou]/g, '*');
        for (const word of wordlist) {
            const lower = word.toLowerCase();
            if (!lowered.has(lower)) {
                lowered.set(lower, word);
            }
            if (!pattern.has(vowelize(lower))) {
                pattern.set(vowelize(lower), word);
            }
        }
        return queries.map((query) => {
            if (exact.has(query)) {
                return query;
            }
            const lower = query.toLowerCase();
            if (lowered.has(lower)) {
                return lowered.get(lower)!;
            }
            return pattern.get(vowelize(lower)) ?? '';
        });
    }
}
