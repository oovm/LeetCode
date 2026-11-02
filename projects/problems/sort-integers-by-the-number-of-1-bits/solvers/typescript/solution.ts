export class Solution {
    sortByBits(arr: number[]): number[] {
        const bitCount = (x: number): number => {
            let count = 0;
            while (x > 0) {
                count += x % 2;
                x = Math.floor(x / 2);
            }
            return count;
        };
        return arr.sort((a, b) => bitCount(a) - bitCount(b) || a - b);
    }
}
