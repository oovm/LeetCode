export class Solution {
    reverseBetween(head: number[], left: number, right: number): number[] {
        const result = [...head];
        for (let i = left - 1, j = right - 1; i < j; i++, j--) {
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}
