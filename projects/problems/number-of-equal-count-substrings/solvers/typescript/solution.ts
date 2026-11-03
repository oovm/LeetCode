export class Solution {
    equalCountSubstrings(s: string, count: number): number {
        let total = 0;
        for (let unique = 1; unique <= 26 && unique * count <= s.length; unique++) {
            const size = unique * count;
            const counts = new Array<number>(26).fill(0);
            let full = 0;
            let present = 0;
            for (let i = 0; i < s.length; i++) {
                const c = s.charCodeAt(i) - 97;
                counts[c] += 1;
                if (counts[c] === 1) present += 1;
                if (counts[c] === count) full += 1;
                if (counts[c] === count + 1) full -= 1;
                if (i >= size) {
                    const out = s.charCodeAt(i - size) - 97;
                    if (counts[out] === count) full -= 1;
                    if (counts[out] === count + 1) full += 1;
                    counts[out] -= 1;
                    if (counts[out] === 0) present -= 1;
                }
                if (i >= size - 1 && full === unique && present === unique) {
                    total += 1;
                }
            }
        }
        return total;
    }
}
