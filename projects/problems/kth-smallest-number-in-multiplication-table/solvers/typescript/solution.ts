export class Solution {
    findKthNumber(m: number, n: number, k: number): number {
        const countLe = (v: number): number => {
            let total = 0;
            for (let i = 1; i <= m; i++) {
                total += Math.min(n, Math.floor(v / i));
            }
            return total;
        };
        let low = 1;
        let high = m * n;
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (countLe(mid) >= k) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }
}
