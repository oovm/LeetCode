function reverseNumber(value: number): number {
    let rest = value;
    let reversed = 0;
    while (rest > 0) {
        reversed = reversed * 10 + (rest % 10);
        rest = Math.floor(rest / 10);
    }
    return reversed;
}

export class Solution {
    countNicePairs(nums: number[]): number {
        const counts = new Map<number, number>();
        let total = 0;
        for (const value of nums) {
            const key = value - reverseNumber(value);
            total += counts.get(key) ?? 0;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        return total % 1000000007;
    }
}
