export class Solution {
    removeNthFromEnd(head: number[], n: number): number[] {
        const result = [...head];
        result.splice(result.length - n, 1);
        return result;
    }
}
