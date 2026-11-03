export class Solution {
    swapPairs(head: number[]): number[] {
        const result = [...head];
        for (let i = 0; i + 1 < result.length; i += 2) {
            [result[i], result[i + 1]] = [result[i + 1], result[i]];
        }
        return result;
    }
}
