export class Solution {
    frequenciesOfElements(head: number[]): number[] {
        const count = new Map<number, number>();
        for (const x of head) count.set(x, (count.get(x) ?? 0) + 1);
        return [...count.values()];
    }
}
