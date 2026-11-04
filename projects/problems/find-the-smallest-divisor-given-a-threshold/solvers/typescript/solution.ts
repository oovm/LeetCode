export class Solution {
    smallestDivisor(nums: number[], threshold: number): number {
        const total = (divisor: number): number => {
            let sum = 0;
            for (const value of nums) sum += Math.ceil(value / divisor);
            return sum;
        };
        let low = 1;
        let high = Math.max(...nums);
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (total(mid) <= threshold) high = mid;
            else low = mid + 1;
        }
        return low;
    }
}
