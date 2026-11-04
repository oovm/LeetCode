export class Solution {
    removeElements(head: number[], val: number): number[] | null {
        const out = head.filter((v) => v !== val);
        return out.length === 0 ? null : out;
    }
}
