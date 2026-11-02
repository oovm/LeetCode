export class Solution {
    numberOfCuts(n: number): number {
        if (n === 1) {
            return 0;
        }
        if (n % 2 === 1) {
            return n;
        }
        return n / 2;
    }
}
