export class Solution {
    shipWithinDays(weights: number[], days: number): number {
        const needed = (capacity: number): number => {
            let d = 1;
            let cur = 0;
            for (const w of weights) {
                if (cur + w > capacity) {
                    d += 1;
                    cur = w;
                } else {
                    cur += w;
                }
            }
            return d;
        };
        let low = Math.max(...weights);
        let high = weights.reduce((sum, w) => sum + w, 0);
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (needed(mid) <= days) high = mid;
            else low = mid + 1;
        }
        return low;
    }
}
