export class Solution {
    largestPalindrome(k: number, n: number): string {
        const halfLen = Math.floor((n + 1) / 2);
        const start = 10n ** BigInt(halfLen) - 1n;
        const end = 10n ** BigInt(halfLen - 1);
        for (let half = start; half >= end; half--) {
            const hs = half.toString();
            const pal =
                n % 2 === 1 ? hs + [...hs.slice(0, -1)].reverse().join('') : hs + [...hs].reverse().join('');
            if (BigInt(pal) % BigInt(k) === 0n) {
                return pal;
            }
        }
        return '';
    }
}
