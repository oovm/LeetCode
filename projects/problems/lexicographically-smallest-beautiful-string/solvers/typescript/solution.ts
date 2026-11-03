export class Solution {
    smallestBeautifulString(s: string, k: number): string {
        const chars = [...s].map((c) => c.charCodeAt(0) - 97);
        const valid = (i: number): boolean =>
            (i < 1 || chars[i] !== chars[i - 1]) && (i < 2 || chars[i] !== chars[i - 2]);
        let i = s.length - 1;
        while (i >= 0) {
            chars[i] += 1;
            while (chars[i] < k && !valid(i)) chars[i] += 1;
            if (chars[i] < k) {
                for (let j = i + 1; j < s.length; j++) {
                    chars[j] = 0;
                    while (!valid(j)) chars[j] += 1;
                }
                return chars.map((c) => String.fromCharCode(97 + c)).join('');
            }
            i -= 1;
        }
        return '';
    }
}
