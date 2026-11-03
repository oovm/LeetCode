export class Solution {
    maximumNumberOfOnes(width: number, height: number, sideLength: number, maxOnes: number): number {
        const counts: number[] = [];
        for (let i = 0; i < sideLength; i++) {
            for (let j = 0; j < sideLength; j++) {
                const wi = Math.floor((width - i - 1 + sideLength) / sideLength);
                const hi = Math.floor((height - j - 1 + sideLength) / sideLength);
                counts.push(wi * hi);
            }
        }
        counts.sort((a, b) => b - a);
        return counts.slice(0, maxOnes).reduce((a, b) => a + b, 0);
    }
}
