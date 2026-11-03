export class Solution {
    checkValidString(s: string): boolean {
        let low = 0;
        let high = 0;
        for (const ch of s) {
            if (ch === '(') {
                low += 1;
                high += 1;
            } else if (ch === ')') {
                low -= 1;
                high -= 1;
            } else {
                low -= 1;
                high += 1;
            }
            if (high < 0) {
                return false;
            }
            low = Math.max(low, 0);
        }
        return low === 0;
    }
}
