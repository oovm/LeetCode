export class Solution {
    minimumSize(nums: number[], maxOperations: number): number {
        const operations = (size: number): number => {
            let total = 0;
            for (const count of nums) total += Math.floor((count - 1) / size);
            return total;
        };
        let low = 1;
        let high = Math.max(...nums);
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (operations(mid) <= maxOperations) high = mid;
            else low = mid + 1;
        }
        return low;
    }
}
