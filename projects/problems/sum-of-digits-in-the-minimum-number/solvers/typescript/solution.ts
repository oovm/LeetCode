export class Solution {
    sumOfDigits(nums: number[]): number {
        const min = Math.min(...nums);
        let sum = 0;
        for (const c of `${min}`) sum += c.charCodeAt(0) - 48;
        return sum % 2 === 0 ? 1 : 0;
    }
}
