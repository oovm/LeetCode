export class Solution {
    findLeastNumOfUniqueInts(arr: number[], k: number): number {
        const counts = new Map<number, number>();
        for (const value of arr) counts.set(value, (counts.get(value) ?? 0) + 1);

        const frequencies = [...counts.values()].sort((a, b) => a - b);
        let removed = 0;
        let remaining = frequencies.length;
        for (const frequency of frequencies) {
            if (removed + frequency <= k) {
                removed += frequency;
                remaining -= 1;
            } else {
                break;
            }
        }
        return remaining;
    }
}
