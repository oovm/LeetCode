export class Solution {
    maxProduct(words: string[]): number {
        const masks = words.map((w) => {
            let m = 0;
            for (const ch of w) m |= 1 << (ch.charCodeAt(0) - 97);
            return m;
        });
        let best = 0;
        for (let i = 0; i < words.length; i++) {
            for (let j = i + 1; j < words.length; j++) {
                if ((masks[i] & masks[j]) === 0) {
                    best = Math.max(best, words[i].length * words[j].length);
                }
            }
        }
        return best;
    }
}
