export class Solution {
    shortestCompletingWord(licensePlate: string, words: string[]): string {
        const need = new Map<string, number>();
        for (const c of licensePlate.toLowerCase()) {
            if (c >= "a" && c <= "z") need.set(c, (need.get(c) ?? 0) + 1);
        }
        let best: string | null = null;
        for (const word of words) {
            const have = new Map<string, number>();
            for (const c of word) have.set(c, (have.get(c) ?? 0) + 1);
            let ok = true;
            for (const [c, n] of need) {
                if ((have.get(c) ?? 0) < n) {
                    ok = false;
                    break;
                }
            }
            if (ok && (best === null || word.length < best.length)) best = word;
        }
        return best!;
    }
}
