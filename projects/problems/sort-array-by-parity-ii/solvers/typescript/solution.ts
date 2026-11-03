export class Solution {
    sortArrayByParityII(nums: number[]): number[] {
        const n = nums.length;
        const out = new Array(n);
        let even = 0;
        let odd = 1;
        for (const v of nums) {
            if (v % 2 === 0) {
                out[even] = v;
                even += 2;
            } else {
                out[odd] = v;
                odd += 2;
            }
        }
        return out;
    }
}
