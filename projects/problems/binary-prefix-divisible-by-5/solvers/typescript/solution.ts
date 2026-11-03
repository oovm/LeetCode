export class Solution {
    prefixesDivBy5(nums: number[]): boolean[] {
        const out: boolean[] = [];
        let value = 0;
        for (const bit of nums) {
            value = (value * 2 + bit) % 5;
            out.push(value === 0);
        }
        return out;
    }
}
