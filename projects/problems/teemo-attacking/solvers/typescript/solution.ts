export class Solution {
    findPoisonedDuration(timeSeries: number[], duration: number): number {
        let total = 0;
        for (let i = 0; i < timeSeries.length; i++) {
            const gap = i + 1 < timeSeries.length ? timeSeries[i + 1] - timeSeries[i] : duration;
            total += Math.min(gap, duration);
        }
        return total;
    }
}
