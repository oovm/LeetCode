export class Solution {
    minimumPushes(word: string): number {
        const first = new Map<string, number>();
        const freq = new Map<string, number>();
        for (const ch of word) {
            if (!first.has(ch)) first.set(ch, first.size);
            freq.set(ch, (freq.get(ch) ?? 0) + 1);
        }
        let pushes = 0;
        for (const [ch, rank] of first) {
            pushes += (Math.floor(rank / 8) + 1) * (freq.get(ch) as number);
        }
        return pushes;
    }
}
