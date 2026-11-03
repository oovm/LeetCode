export class Solution {
    smallestString(s: string): string {
        const chars = s.split('');
        const n = chars.length;
        let i = 0;
        while (i < n && chars[i] === 'a') i += 1;
        if (i === n) {
            chars[n - 1] = 'z';
            return chars.join('');
        }
        let j = i;
        while (j < n && chars[j] !== 'a') {
            chars[j] = String.fromCharCode(chars[j].charCodeAt(0) - 1);
            j += 1;
        }
        return chars.join('');
    }
}
