export class Solution {
    findLucky(arr: number[]): number {
        const count = new Map<number, number>();
        for (const v of arr) count.set(v, (count.get(v) ?? 0) + 1);
        let best = -1;
        for (const [v, c] of count) {
            if (v === c && v > best) best = v;
        }
        return best;
    }
}
