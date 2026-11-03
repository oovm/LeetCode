export class Solution {
    numberOfSubstrings(s: string, k: number): number {
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            const counts = new Array<number>(26).fill(0);
            for (let j = i; j < s.length; j++) {
                counts[s.charCodeAt(j) - 97] += 1;
                if (counts.some((c) => c === k)) {
                    total += 1;
                }
            }
        }
        return total;
    }
}
