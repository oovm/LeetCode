export class Solution {
    reverseWords(s: string[]): void {
        s.reverse();
        let start = 0;
        for (let i = 0; i <= s.length; i++) {
            if (i === s.length || s[i] === " ") {
                for (let a = start, b = i - 1; a < b; a++, b--) [s[a], s[b]] = [s[b], s[a]];
                start = i + 1;
            }
        }
    }
}
