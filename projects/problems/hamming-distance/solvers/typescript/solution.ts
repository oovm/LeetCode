export class Solution {
    hammingDistance(x: number, y: number): number {
        let diff = (x ^ y) >>> 0;
        let count = 0;
        while (diff > 0) {
            count += diff & 1;
            diff >>>= 1;
        }
        return count;
    }
}
