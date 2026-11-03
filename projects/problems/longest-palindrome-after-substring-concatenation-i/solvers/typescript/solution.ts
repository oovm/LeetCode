export class Solution {
    longestPalindrome(s: string, t: string): number {
        const isPalindrome = (x: string): boolean => x === [...x].reverse().join('');
        let best = 0;
        for (let i = 0; i <= s.length; i++) {
            for (let j = i; j <= s.length; j++) {
                const a = s.slice(i, j);
                for (let p = 0; p <= t.length; p++) {
                    for (let q = p; q <= t.length; q++) {
                        const b = t.slice(p, q);
                        if (isPalindrome(a + b)) {
                            best = Math.max(best, a.length + b.length);
                        }
                    }
                }
            }
        }
        return best;
    }
}
