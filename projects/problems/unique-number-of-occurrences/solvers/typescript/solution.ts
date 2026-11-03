export class Solution {
    uniqueOccurrences(arr: number[]): boolean {
        const count = new Map<number, number>();
        for (const v of arr) count.set(v, (count.get(v) ?? 0) + 1);
        return new Set(count.values()).size === count.size;
    }
}
