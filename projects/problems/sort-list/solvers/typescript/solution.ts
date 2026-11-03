export class Solution {
    sortList(head: number[]): number[] {
        return [...head].sort((a, b) => a - b);
    }
}
