export class Solution {
    minimizeMax(nums: number[], p: number): number {
        const ordered = [...nums].sort((a, b) => a - b);
        const pairsWithin = (limit: number): number => {
            let pairs = 0;
            let index = 0;
            while (index + 1 < ordered.length) {
                if (ordered[index + 1] - ordered[index] <= limit) {
                    pairs += 1;
                    index += 2;
                } else {
                    index += 1;
                }
            }
            return pairs;
        };
        let low = 0;
        let high = ordered[ordered.length - 1] - ordered[0];
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (pairsWithin(mid) >= p) high = mid;
            else low = mid + 1;
        }
        return low;
    }
}
