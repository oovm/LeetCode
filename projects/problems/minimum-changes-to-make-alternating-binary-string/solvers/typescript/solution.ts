export class Solution {
    minOperations(s: string): number {
        let mismatches = 0;
        for (let i = 0; i < s.length; i++) {
            if (s[i] !== (i % 2 === 0 ? '0' : '1')) {
                mismatches += 1;
            }
        }
        return Math.min(mismatches, s.length - mismatches);
    }
}
