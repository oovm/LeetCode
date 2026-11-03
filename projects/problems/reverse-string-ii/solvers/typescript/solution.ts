export class Solution {
    reverseStr(s: string, k: number): string {
        const chars = s.split('');
        for (let start = 0; start < chars.length; start += 2 * k) {
            const end = Math.min(start + k, chars.length);
            for (let i = start, j = end - 1; i < j; i++, j--) {
                [chars[i], chars[j]] = [chars[j], chars[i]];
            }
        }
        return chars.join('');
    }
}
