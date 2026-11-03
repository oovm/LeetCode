export class Solution {
    reorderList(head: number[]): void {
        const tail = head.splice(Math.ceil(head.length / 2)).reverse();
        let i = 0;
        for (const v of tail) {
            head.splice(i + 1, 0, v);
            i += 2;
        }
    }
}
