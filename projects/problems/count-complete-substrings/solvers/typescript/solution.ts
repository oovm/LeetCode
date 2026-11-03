export class Solution {
    countCompleteSubstrings(k: number, word: string): number {
        let total = 0;
        let i = 0;
        while (i < word.length) {
            let j = i;
            while (j + 1 < word.length && Math.abs(word.charCodeAt(j + 1) - word.charCodeAt(j)) <= 2) j += 1;
            const seg = word.slice(i, j + 1);
            for (let unique = 1; unique <= 26 && unique * k <= seg.length; unique++) {
                const size = unique * k;
                const counts = new Array<number>(26).fill(0);
                let full = 0;
                let present = 0;
                for (let p = 0; p < seg.length; p++) {
                    const c = seg.charCodeAt(p) - 97;
                    counts[c] += 1;
                    if (counts[c] === 1) present += 1;
                    if (counts[c] === k) full += 1;
                    if (counts[c] === k + 1) full -= 1;
                    if (p >= size) {
                        const out = seg.charCodeAt(p - size) - 97;
                        if (counts[out] === k) full -= 1;
                        if (counts[out] === k + 1) full += 1;
                        counts[out] -= 1;
                        if (counts[out] === 0) present -= 1;
                    }
                    if (p >= size - 1 && full === unique && present === unique) total += 1;
                }
            }
            i = j + 1;
        }
        return total;
    }
}
