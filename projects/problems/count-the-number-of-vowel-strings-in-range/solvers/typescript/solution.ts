export class Solution {
    vowelStrings(words: string[], left: number, right: number): number {
        const vowels = new Set("aeiou");
        let count = 0;
        for (let i = left; i <= right; i++) {
            const w = words[i];
            if (vowels.has(w[0]) && vowels.has(w[w.length - 1])) count++;
        }
        return count;
    }
}
