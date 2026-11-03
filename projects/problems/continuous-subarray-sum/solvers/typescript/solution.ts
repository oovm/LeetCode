export class Solution {
    checkSubarraySum(nums: number[], k: number): boolean {
        const firstSeen = new Map<number, number>([[0, -1]]);
        let sum = 0;
        for (let i = 0; i < nums.length; i++) {
            sum = (sum + nums[i]) % k;
            if (firstSeen.has(sum)) {
                if (i - firstSeen.get(sum)! >= 2) return true;
            } else firstSeen.set(sum, i);
        }
        return false;
    }
}
