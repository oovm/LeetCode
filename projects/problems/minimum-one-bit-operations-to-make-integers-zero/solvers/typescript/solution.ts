export class Solution {
    minimumOneBitOperations(n: number): number {
        let result = 0;
        let rest = n;
        while (rest > 0) {
            result ^= rest;
            rest = Math.floor(rest / 2);
        }
        return result;
    }
}
