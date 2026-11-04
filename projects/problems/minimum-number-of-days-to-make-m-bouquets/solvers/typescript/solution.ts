export class Solution {
    minDays(bloomDay: number[], m: number, k: number): number {
        if (m * k > bloomDay.length) return -1;
        const bouquets = (day: number): number => {
            let total = 0;
            let run = 0;
            for (const value of bloomDay) {
                if (value <= day) {
                    run += 1;
                    if (run === k) {
                        total += 1;
                        run = 0;
                    }
                } else {
                    run = 0;
                }
            }
            return total;
        };
        let low = 0;
        let high = Math.max(...bloomDay);
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (bouquets(mid) >= m) high = mid;
            else low = mid + 1;
        }
        return low;
    }
}
