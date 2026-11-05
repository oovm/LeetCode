export class Solution {
    minSubarray(nums: number[], p: number): number {
        const n = nums.length;
        let total = 0;
        for (const value of nums) {
            total = (total + value) % p;
        }
        if (total === 0) {
            return 0;
        }
        const needed = total;
        const first = new Map<number, number>();
        first.set(0, -1);
        let prefix = 0;
        let shortest = n;
        for (let i = 0; i < n; i++) {
            prefix = (prefix + nums[i]) % p;
            const wanted = (((prefix - needed) % p) + p) % p;
            const previous = first.get(wanted);
            if (previous !== undefined) {
                shortest = Math.min(shortest, i - previous);
            }
            first.set(prefix, i);
        }
        return shortest === n ? -1 : shortest;
    }
}
