export class Solution {
    maxFreq(maxLetters: number, s: string, maxSize: number, minSize: number): number {
        const freq = new Map<string, number>();
        let best = 0;
        const counts = new Array<number>(26).fill(0);
        let distinct = 0;
        for (let i = 0; i < s.length; i++) {
            const c = s.charCodeAt(i) - 97;
            if (counts[c] === 0) distinct += 1;
            counts[c] += 1;
            if (i >= minSize) {
                const out = s.charCodeAt(i - minSize) - 97;
                counts[out] -= 1;
                if (counts[out] === 0) distinct -= 1;
            }
            if (i >= minSize - 1 && distinct <= maxLetters) {
                const sub = s.slice(i - minSize + 1, i + 1);
                const f = (freq.get(sub) ?? 0) + 1;
                freq.set(sub, f);
                best = Math.max(best, f);
            }
        }
        return best;
    }
}
