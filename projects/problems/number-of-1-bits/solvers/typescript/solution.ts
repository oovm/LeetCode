export class Solution {
    hammingWeight(n: number): number {
        let value = n;
        let count = 0;
        while (value > 0) {
            count += value % 2;
            value = Math.floor(value / 2);
        }
        return count;
    }
}
