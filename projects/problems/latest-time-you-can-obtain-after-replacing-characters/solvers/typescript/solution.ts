export class Solution {
    findLatestTime(s: string): string {
        const chars = s.split('');
        if (chars[0] === '?') {
            chars[0] = chars[1] === '?' || chars[1] <= '1' ? '1' : '0';
        }
        if (chars[1] === '?') {
            chars[1] = chars[0] === '0' ? '9' : '1';
        }
        if (chars[3] === '?') chars[3] = '5';
        if (chars[4] === '?') chars[4] = '9';
        return chars.join('');
    }
}
