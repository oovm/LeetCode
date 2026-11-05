export class Solution {
    maxScore(cardPoints: number[], k: number): number {
        const n = cardPoints.length;
        let total = 0;
        for (const point of cardPoints) {
            total += point;
        }
        if (k >= n) {
            return total;
        }
        const windowSize = n - k;
        let window = 0;
        for (let i = 0; i < windowSize; i++) {
            window += cardPoints[i];
        }
        let smallest = window;
        for (let i = windowSize; i < n; i++) {
            window += cardPoints[i] - cardPoints[i - windowSize];
            smallest = Math.min(smallest, window);
        }
        return total - smallest;
    }
}
