export class Solution {
    isStrictlyPalindromic(n: number): boolean {
        for (let base = 2; base <= n - 2; base++) {
            const digits = n.toString(base);
            if (digits !== [...digits].reverse().join('')) {
                return false;
            }
        }
        return true;
    }
}
