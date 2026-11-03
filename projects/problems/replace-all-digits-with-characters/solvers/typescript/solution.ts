export class Solution {
    replaceDigits(s: string): string {
        const chars = s.split('');
        for (let i = 1; i < chars.length; i += 2) {
            chars[i] = String.fromCharCode(chars[i - 1].charCodeAt(0) + (chars[i].charCodeAt(0) - 48));
        }
        return chars.join('');
    }
}
