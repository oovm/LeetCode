export class Solution {
    oddEvenList(head: number[]): number[] {
        const odd = head.filter((_, i) => i % 2 === 0);
        const even = head.filter((_, i) => i % 2 === 1);
        return [...odd, ...even];
    }
}
