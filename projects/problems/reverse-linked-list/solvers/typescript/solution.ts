export class Solution {
    reverseList(head: number[]): number[] | null {
        if (head.length === 0) return null;
        return [...head].reverse();
    }
}
