export class Solution {
    countDivisibleSubstrings(word: string): number {
        const weight = (ch: string): number => {
            const idx = ch.charCodeAt(0) - 97;
            return idx < 2 ? 1 : Math.floor((idx - 2) / 3) + 2;
        };
        let total = 0;
        for (let i = 0; i < word.length; i++) {
            let sum = 0;
            for (let j = i; j < word.length; j++) {
                sum += weight(word[j]);
                if (sum % (j - i + 1) === 0) {
                    total += 1;
                }
            }
        }
        return total;
    }
}
