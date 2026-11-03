export class Solution {
    closeStrings(word1: string, word2: string): boolean {
        if (word1.length !== word2.length) {
            return false;
        }
        const count = (w: string): number[] => {
            const c = new Array<number>(26).fill(0);
            for (const ch of w) {
                c[ch.charCodeAt(0) - 97] += 1;
            }
            return c;
        };
        const a = count(word1);
        const b = count(word2);
        const sameSet = a.every((v, i) => v > 0 === b[i] > 0);
        const sameFreqs =
            a.filter((v) => v > 0).sort((x, y) => x - y).join(',') ===
            b.filter((v) => v > 0).sort((x, y) => x - y).join(',');
        return sameSet && sameFreqs;
    }
}
