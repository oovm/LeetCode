export class Solution {
    countSegments(s: string): number {
        let count = 0;
        for (let i = 0; i < s.length; i++) {
            if (!Solution.isBlank(s[i]) && (i === 0 || Solution.isBlank(s[i - 1]))) {
                count += 1;
            }
        }
        return count;
    }

    private static isBlank(ch: string): boolean {
        return /\s/.test(ch);
    }
}
