export class Solution {
    maxNumberOfBalloons(text: string): number {
        const counts = new Map<string, number>();
        for (const ch of text) {
            counts.set(ch, (counts.get(ch) ?? 0) + 1);
        }
        const get = (ch: string): number => counts.get(ch) ?? 0;
        return Math.min(get('b'), get('a'), Math.floor(get('l') / 2), Math.floor(get('o') / 2), get('n'));
    }
}
