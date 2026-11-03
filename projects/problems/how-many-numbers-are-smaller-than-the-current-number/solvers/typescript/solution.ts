export class Solution {
    smallerNumbersThanCurrent(nums: number[]): number[] {
        const sorted = [...nums].sort((a, b) => a - b);
        const rank = new Map<number, number>();
        sorted.forEach((v, i) => {
            if (!rank.has(v)) rank.set(v, i);
        });
        return nums.map((v) => rank.get(v)!);
    }
}
