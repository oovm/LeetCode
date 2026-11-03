export class Solution {
    minimumSteps(s: string): number {
        let steps = 0;
        let ones = 0;
        for (const ch of s) {
            if (ch === '1') ones += 1;
            else steps += ones;
        }
        return steps;
    }
}
