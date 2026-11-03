export class Solution {
    preimageSizeFZF(k: number): number {
        const zeros = (x: number): number => {
            let total = 0;
            for (let d = 5; d <= x; d *= 5) {
                total += Math.floor(x / d);
            }
            return total;
        };
        let low = 0;
        let high = 5 * (k + 1);
        while (low <= high) {
            const mid = low + Math.floor((high - low) / 2);
            const z = zeros(mid);
            if (z === k) {
                return 5;
            }
            if (z < k) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return 0;
    }
}
