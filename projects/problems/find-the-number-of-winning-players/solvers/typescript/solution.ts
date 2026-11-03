export class Solution {
    winningPlayerCount(n: number, pick: number[][]): number {
        const count: Map<number, number>[] = Array.from({ length: n }, () => new Map());
        for (const [player, color] of pick) {
            const m = count[player];
            m.set(color, (m.get(color) ?? 0) + 1);
        }
        let winners = 0;
        for (let i = 0; i < n; i++) {
            if ([...count[i].values()].some((c) => c > i)) winners++;
        }
        return winners;
    }
}
