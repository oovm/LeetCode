export class Solution {
    longestWord(words: string[]): string {
        const present = new Set(words);
        const sorted = [...words].sort((a, b) => (b.length - a.length) || (a < b ? -1 : a > b ? 1 : 0));
        for (const word of sorted) {
            let buildable = true;
            for (let size = 1; size < word.length; size += 1) {
                if (!present.has(word.slice(0, size))) {
                    buildable = false;
                    break;
                }
            }
            if (buildable) {
                return word;
            }
        }
        return "";
    }
}
