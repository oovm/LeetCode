export class Solution {
    canBeValid(s: string, locked: string): boolean {
        if (s.length % 2 === 1) {
            return false;
        }
        let low = 0;
        for (let i = 0; i < s.length; i++) {
            if (s[i] === '(' || locked[i] === '0') low += 1;
            else low -= 1;
            if (low < 0) return false;
        }
        let high = 0;
        for (let i = s.length - 1; i >= 0; i--) {
            if (s[i] === ')' || locked[i] === '0') high += 1;
            else high -= 1;
            if (high < 0) return false;
        }
        return true;
    }
}
