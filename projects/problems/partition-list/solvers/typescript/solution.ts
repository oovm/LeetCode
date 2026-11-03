export class Solution {
    partition(head: number[], x: number): number[] {
        const before = head.filter((v) => v < x);
        const after = head.filter((v) => v >= x);
        return [...before, ...after];
    }
}
