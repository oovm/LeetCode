export class Solution {
    reverseWords(s: string): string {
        return s
            .split(' ')
            .map((word) => [...word].reverse().join(''))
            .join(' ');
    }
}
