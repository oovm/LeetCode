export class Solution {
    findRadius(houses: number[], heaters: number[]): number {
        heaters.sort((a, b) => a - b);
        let best = 0;
        for (const h of houses) {
            let lo = 0;
            let hi = heaters.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if (heaters[mid] < h) lo = mid + 1;
                else hi = mid;
            }
            const d1 = lo < heaters.length ? heaters[lo] - h : Infinity;
            const d2 = lo > 0 ? h - heaters[lo - 1] : Infinity;
            best = Math.max(best, Math.min(d1, d2));
        }
        return best;
    }
}
