export class Solution {
    maxVowels(s: string, k: number): number {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        let count = 0;
        for (let i = 0; i < k; i++) {
            if (vowels.has(s[i])) count += 1;
        }
        let best = count;
        for (let i = k; i < s.length; i++) {
            if (vowels.has(s[i])) count += 1;
            if (vowels.has(s[i - k])) count -= 1;
            best = Math.max(best, count);
        }
        return best;
    }
}
