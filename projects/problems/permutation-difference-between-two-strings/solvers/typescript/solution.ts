export class Solution {
    findPermutationDifference(s: string, t: string): number {
        const position = new Map<string, number>();
        for (let i = 0; i < s.length; i++) {
            position.set(s[i], i);
        }
        let total = 0;
        for (let i = 0; i < t.length; i++) {
            total += Math.abs(i - (position.get(t[i]) ?? 0));
        }
        return total;
    }
}
