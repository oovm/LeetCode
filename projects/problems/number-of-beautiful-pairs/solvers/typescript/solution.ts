export class Solution {
    countBeautifulPairs(nums: number[]): number {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const firstDigit = (x: number) => Number(String(x)[0]);
        let count = 0;
        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                if (gcd(firstDigit(nums[i]), nums[j] % 10) === 1) count++;
            }
        }
        return count;
    }
}
