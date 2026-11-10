export class Solution {
    findGCD(nums: number[]): number {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        return gcd(Math.min(...nums), Math.max(...nums));
    }
}
