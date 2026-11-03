export class Solution {
    findRelativeRanks(score: number[]): string[] {
        const indexed = score.map((s, i) => [s, i] as const);
        indexed.sort((a, b) => b[0] - a[0]);
        const out: string[] = new Array(score.length);
        const medal = ["Gold Medal", "Silver Medal", "Bronze Medal"];
        for (let rank = 0; rank < indexed.length; rank++) {
            const idx = indexed[rank][1];
            out[idx] = rank < 3 ? medal[rank] : `${rank + 1}`;
        }
        return out;
    }
}
