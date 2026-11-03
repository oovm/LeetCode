export class Solution {
    canAliceWin(nums: number[]): boolean {
        let single = 0;
        let double = 0;
        for (const x of nums) {
            if (x < 10) single += x;
            else double += x;
        }
        return single !== double;
    }
}
