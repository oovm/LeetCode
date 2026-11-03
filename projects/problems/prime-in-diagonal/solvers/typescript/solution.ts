export class Solution {
    diagonalPrime(nums: number[][]): number {
        const isPrime = (x: number) => {
            if (x < 2) return false;
            for (let d = 2; d * d <= x; d++) if (x % d === 0) return false;
            return true;
        };
        let best = 0;
        for (let i = 0; i < nums.length; i++) {
            if (isPrime(nums[i][i])) best = Math.max(best, nums[i][i]);
            const j = nums.length - 1 - i;
            if (isPrime(nums[i][j])) best = Math.max(best, nums[i][j]);
        }
        return best;
    }
}
