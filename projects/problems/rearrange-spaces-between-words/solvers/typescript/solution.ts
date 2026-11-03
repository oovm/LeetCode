export class Solution {
    reorderSpaces(text: string): string {
        const spaces = [...text].filter((c) => c === ' ').length;
        const words = text.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0] + ' '.repeat(spaces);
        }
        const gap = Math.floor(spaces / (words.length - 1));
        const rest = spaces % (words.length - 1);
        return words.join(' '.repeat(gap)) + ' '.repeat(rest);
    }
}
