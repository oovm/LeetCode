export class Solution {
    getSmallestString(s: string): string {
        const chars = s.split('');
        for (let i = 0; i + 1 < chars.length; i++) {
            const a = chars[i].charCodeAt(0) - 48;
            const b = chars[i + 1].charCodeAt(0) - 48;
            if (a % 2 === b % 2 && a > b) {
                [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
                break;
            }
        }
        return chars.join('');
    }
}
