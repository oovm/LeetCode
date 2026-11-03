export class Solution {
    findMaxLength(nums: number[]): number {
        const firstSeen = new Map<number, number>([[0, -1]]);
        let balance = 0;
        let best = 0;
        for (let i = 0; i < nums.length; i++) {
            balance += nums[i] === 1 ? 1 : -1;
            if (firstSeen.has(balance)) best = Math.max(best, i - firstSeen.get(balance)!);
            else firstSeen.set(balance, i);
        }
        return best;
    }
}
