export class Solution {
    isPossible(nums: number[]): boolean {
        const counts = new Map<number, number>();
        for (const value of nums) {
            counts.set(value, (counts.get(value) ?? 0) + 1);
        }
        const keys = [...counts.keys()].sort((a, b) => a - b);
        const tails = new Map<number, number>();
        for (const value of keys) {
            let available = counts.get(value)!;
            const chain = tails.get(value) ?? 0;
            if (chain > 0) {
                const used = Math.min(available, chain);
                available -= used;
                tails.set(value, chain - used);
                tails.set(value + 1, (tails.get(value + 1) ?? 0) + used);
            }
            if (available > 0) {
                const first = counts.get(value + 1) ?? -1;
                const second = counts.get(value + 2) ?? -1;
                if (first < available || second < available) {
                    return false;
                }
                counts.set(value + 1, first - available);
                counts.set(value + 2, second - available);
                tails.set(value + 3, (tails.get(value + 3) ?? 0) + available);
            }
        }
        return true;
    }
}
