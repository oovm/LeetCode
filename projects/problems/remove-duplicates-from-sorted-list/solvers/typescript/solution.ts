export class Solution {
    deleteDuplicates(head: number[]): number[] | null {
        if (head.length === 0) return null;
        return head.filter((v, i) => i === 0 || v !== head[i - 1]);
    }
}
