export class Solution {
    findSubstringInWraproundString(s: string): number {
        const longest = new Array<number>(26).fill(0);
        let run = 0;
        for (let i = 0; i < s.length; i++) {
            if (i > 0 && (s.charCodeAt(i) - s.charCodeAt(i - 1) + 26) % 26 === 1) {
                run += 1;
            } else {
                run = 1;
            }
            const idx = s.charCodeAt(i) - 97;
            longest[idx] = Math.max(longest[idx], run);
        }
        return longest.reduce((a, b) => a + b, 0);
    }
}
