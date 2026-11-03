export class Solution {
    arrangeWords(text: string): string {
        const words = text.toLowerCase().split(' ');
        words.sort((a, b) => a.length - b.length);
        const joined = words.join(' ');
        return joined[0].toUpperCase() + joined.slice(1);
    }
}
