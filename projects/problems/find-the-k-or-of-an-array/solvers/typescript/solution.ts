export class Solution {
    findKOr(nums: number[], k: number): number {
        let result = 0;
        for (let bit = 0; bit < 32; bit++) {
            let count = 0;
            for (const x of nums) if ((x >> bit) & 1) count++;
            if (count >= k) result |= 1 << bit;
        }
        return result;
    }
}
