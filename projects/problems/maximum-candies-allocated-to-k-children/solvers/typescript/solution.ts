export class Solution {
    maximumCandies(candies: number[], k: number): number {
        const portions = (size: number): number => {
            let total = 0;
            for (const count of candies) total += Math.floor(count / size);
            return total;
        };
        const total = candies.reduce((sum, count) => sum + count, 0);
        if (total < k) return 0;
        let low = 1;
        let high = Math.max(...candies);
        while (low < high) {
            const mid = low + Math.floor((high - low + 1) / 2);
            if (portions(mid) >= k) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
