export class Solution {
    minCapability(nums: number[], k: number): number {
        const enough = (cap: number): boolean => {
            let taken = 0;
            let index = 0;
            while (index < nums.length) {
                if (nums[index] <= cap) {
                    taken += 1;
                    index += 2;
                } else {
                    index += 1;
                }
            }
            return taken >= k;
        };
        let low = Math.min(...nums);
        let high = Math.max(...nums);
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (enough(mid)) high = mid;
            else low = mid + 1;
        }
        return low;
    }
}
