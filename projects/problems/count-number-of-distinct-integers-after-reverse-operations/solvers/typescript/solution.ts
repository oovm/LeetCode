export class Solution {
    countDistinctIntegers(nums: number[]): number {
        const seen = new Set<number>();
        for (const value of nums) {
            seen.add(value);
            seen.add(this.reverseNumber(value));
        }
        return seen.size;
    }

    private reverseNumber(value: number): number {
        let reversed = 0;
        let rest = value;
        while (rest > 0) {
            reversed = reversed * 10 + (rest % 10);
            rest = Math.floor(rest / 10);
        }
        return reversed;
    }
}
