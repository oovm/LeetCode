export class Solution {
    titleToNumber(s: string): number {
        let result = 0;
        for (const ch of s) {
            result = result * 26 + (ch.charCodeAt(0) - 64);
        }
        return result;
    }
}
