export class Solution {
    beautifulSubstrings(s: string, k: number): number {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            let v = 0;
            for (let j = i; j < s.length; j++) {
                if (vowels.has(s[j])) v += 1;
                const len = j - i + 1;
                const consonants = len - v;
                if (v === consonants && (v * consonants) % k === 0) {
                    total += 1;
                }
            }
        }
        return total;
    }
}
