export class Solution {
    middleNode(head: number[]): number[] {
        return head.slice(Math.floor(head.length / 2));
    }
}
