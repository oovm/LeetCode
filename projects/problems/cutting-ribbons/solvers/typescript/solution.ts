export class Solution {
    maxLength(ribbons: number[], k: number): number {
        const pieces = (size: number): number => {
            let total = 0;
            for (const length of ribbons) total += Math.floor(length / size);
            return total;
        };
        const total = ribbons.reduce((sum, length) => sum + length, 0);
        if (total < k) return 0;
        let low = 1;
        let high = Math.max(...ribbons);
        while (low < high) {
            const mid = low + Math.floor((high - low + 1) / 2);
            if (pieces(mid) >= k) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
