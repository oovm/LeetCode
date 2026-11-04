export class Solution {
    canReorderDoubled(arr: number[]): boolean {
        const ordered = [...arr].sort((a, b) => Math.abs(a) - Math.abs(b));
        const counts = new Map<number, number>();
        for (const value of ordered) counts.set(value, (counts.get(value) ?? 0) + 1);

        for (const value of ordered) {
            const amount = counts.get(value)!;
            if (amount === 0) continue;
            counts.set(value, amount - 1);

            const doubled = value * 2;
            const doubledAmount = counts.get(doubled) ?? 0;
            if (doubledAmount === 0) return false;
            counts.set(doubled, doubledAmount - 1);
        }
        return true;
    }
}
