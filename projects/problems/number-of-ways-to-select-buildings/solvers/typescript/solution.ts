export class Solution {
    numberOfWays(s: string): number {
        let zeros = 0;
        let ones = 0;
        for (const ch of s) {
            if (ch === '0') zeros += 1;
            else ones += 1;
        }
        let leftZeros = 0;
        let leftOnes = 0;
        let total = 0;
        for (const ch of s) {
            if (ch === '0') {
                total += leftOnes * (ones - leftOnes);
                leftZeros += 1;
            } else {
                total += leftZeros * (zeros - leftZeros);
                leftOnes += 1;
            }
        }
        return total;
    }
}
