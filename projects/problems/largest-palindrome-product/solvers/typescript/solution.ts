export class Solution {
    largestPalindrome(n: number): number {
        if (n === 1) {
            return 9;
        }
        const upperMax = 10 ** n - 1;
        const lowerMin = 10 ** (n - 1);
        for (let half = upperMax - 1; half > lowerMin; half--) {
            const palindrome = half * 10 ** n + Number(String(half).split('').reverse().join(''));
            for (let d = upperMax; d * d >= palindrome; d--) {
                if (palindrome % d === 0) {
                    return Number(BigInt(palindrome) % 1337n);
                }
            }
        }
        return 0;
    }
}
