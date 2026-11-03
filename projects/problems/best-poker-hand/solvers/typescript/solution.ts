export class Solution {
    bestHand(ranks: number[], suits: string[]): string {
        if (new Set(suits).size === 1) return "Flush";
        const count = new Map<number, number>();
        for (const r of ranks) count.set(r, (count.get(r) ?? 0) + 1);
        const best = Math.max(...count.values());
        if (best >= 3) return "Three of a Kind";
        if (best === 2) return "Pair";
        return "High Card";
    }
}
