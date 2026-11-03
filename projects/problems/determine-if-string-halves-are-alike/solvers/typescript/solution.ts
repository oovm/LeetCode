export class Solution {
    halvesAreAlike(s: string): boolean {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
        const count = (part: string): number => [...part].filter((c) => vowels.has(c)).length;
        const half = s.length / 2;
        return count(s.slice(0, half)) === count(s.slice(half));
    }
}
