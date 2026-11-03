export class Solution {
    shortestMatchingSubstring(s: string, p: string): number {
        const star1 = p.indexOf('*');
        const star2 = p.lastIndexOf('*');
        const parts = [p.slice(0, star1), p.slice(star1 + 1, star2), p.slice(star2 + 1)];
        const kmpAll = (text: string, pat: string): number[] => {
            if (pat === '') {
                return Array.from({ length: text.length + 1 }, (_, i) => i);
            }
            const fail = new Array<number>(pat.length).fill(0);
            for (let i = 1, j = 0; i < pat.length; i++) {
                while (j > 0 && pat[i] !== pat[j]) j = fail[j - 1];
                if (pat[i] === pat[j]) j += 1;
                fail[i] = j;
            }
            const hits: number[] = [];
            let j = 0;
            for (let i = 0; i < text.length; i++) {
                while (j > 0 && text[i] !== pat[j]) j = fail[j - 1];
                if (text[i] === pat[j]) j += 1;
                if (j === pat.length) {
                    hits.push(i - pat.length + 1);
                    j = fail[j - 1];
                }
            }
            return hits;
        };
        const [a, b, c] = parts;
        const startsA = kmpAll(s, a);
        let best = Infinity;
        for (const start of startsA) {
            const midFrom = start + a.length;
            const startsB = kmpAll(s.slice(midFrom), b).map((x) => x + midFrom);
            for (const midStart of startsB) {
                const endFrom = midStart + b.length;
                const startsC = kmpAll(s.slice(endFrom), c).map((x) => x + endFrom);
                if (startsC.length > 0) {
                    best = Math.min(best, startsC[0] + c.length - start);
                }
            }
        }
        return best === Infinity ? -1 : best;
    }
}
