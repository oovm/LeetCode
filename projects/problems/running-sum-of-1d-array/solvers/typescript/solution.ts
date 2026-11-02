export class Solution {
    runningSum(nums: number[]): number[] {
        const out: number[] = [];
        let acc = 0;
        for (const x of nums) {
            acc += x;
            out.push(acc);
        }
        return out;
    }
}
