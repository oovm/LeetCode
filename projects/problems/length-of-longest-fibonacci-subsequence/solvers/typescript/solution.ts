export class Solution {
    lenLongestFibSubseq(arr: number[]): number {
        const n = arr.length;
        const position = new Map<number, number>();
        for (let i = 0; i < n; i++) {
            position.set(arr[i], i);
        }
        const lengths = new Map<number, number>();
        let best = 0;
        for (let current = 1; current < n; current++) {
            for (let previous = 0; previous < current; previous++) {
                const target = arr[current] - arr[previous];
                const base = position.get(target);
                if (base !== undefined && base < previous) {
                    const length = lengths.get(base * n + previous) ?? 2;
                    const nextLength = length + 1;
                    lengths.set(previous * n + current, nextLength);
                    best = Math.max(best, nextLength);
                }
            }
        }
        return best;
    }
}
