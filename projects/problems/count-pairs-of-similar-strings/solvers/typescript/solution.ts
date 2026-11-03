export class Solution {
    similarPairs(words: string[]): number {
        const mask = (w: string) => {
            let m = 0;
            for (const ch of w) m |= 1 << (ch.charCodeAt(0) - 97);
            return m;
        };
        let count = 0;
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                if (mask(words[i]) === mask(words[j])) count++;
            }
        }
        return count;
    }
}
