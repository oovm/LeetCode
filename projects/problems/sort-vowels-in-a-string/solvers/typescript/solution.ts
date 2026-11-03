export class Solution {
    sortVowels(s: string): string {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
        const collected = [...s].filter((c) => vowels.has(c)).sort();
        const out = s.split('');
        let i = 0;
        for (let j = 0; j < out.length; j++) {
            if (vowels.has(out[j])) {
                out[j] = collected[i];
                i += 1;
            }
        }
        return out.join('');
    }
}
