export class Solution {
    maxRepOpt1(text: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of text) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        let best = 0;
        let i = 0;
        while (i < text.length) {
            let j = i;
            while (j < text.length && text[j] === text[i]) j += 1;
            const firstLen = j - i;
            let k = j + 1;
            while (k < text.length && text[k] === text[i]) k += 1;
            const secondLen = k - j - 1;
            const c = text.charCodeAt(i) - 97;
            best = Math.max(best, Math.min(firstLen + secondLen + 1, counts[c]));
            i = j;
        }
        return best;
    }
}
