export class Solution {
    equalDigitFrequency(s: string): number {
        const seen = new Set<string>();
        for (let i = 0; i < s.length; i++) {
            const counts = new Array<number>(10).fill(0);
            let distinct = 0;
            let maxFreq = 0;
            for (let j = i; j < s.length; j++) {
                const d = s.charCodeAt(j) - 48;
                if (counts[d] === 0) distinct += 1;
                counts[d] += 1;
                maxFreq = Math.max(maxFreq, counts[d]);
                if (maxFreq * distinct === j - i + 1) {
                    seen.add(s.slice(i, j + 1));
                }
            }
        }
        return seen.size;
    }
}
