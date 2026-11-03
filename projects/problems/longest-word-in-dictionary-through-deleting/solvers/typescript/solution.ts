export class Solution {
    findLongestWord(s: string, dictionary: string[]): string {
        let best = "";
        for (const w of dictionary) {
            let i = 0;
            for (const ch of s) if (w[i] === ch) i++;
            if (i === w.length) {
                if (w.length > best.length || (w.length === best.length && w < best)) best = w;
            }
        }
        return best;
    }
}
