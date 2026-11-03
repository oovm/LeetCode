export class Solution {
    checkIfCanBreak(s1: string, s2: string): boolean {
        const sortChars = (s: string): string[] => [...s].sort();
        const a = sortChars(s1);
        const b = sortChars(s2);
        const dominates = (x: string[], y: string[]): boolean => x.every((c, i) => c >= y[i]);
        return dominates(a, b) || dominates(b, a);
    }
}
