export class Solution {
    deleteDuplicates(head: number[]): number[] {
        return head.filter((v, i) => i === 0 || v !== head[i - 1]);
    }
}
