export class Solution {
    removeElements(head: number[], val: number): number[] {
        return head.filter((v) => v !== val);
    }
}
