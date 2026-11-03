export class Solution {
    checkPalindromeFormation(a: string, b: string): boolean {
        const isPalindrome = (s: string, i: number, j: number): boolean => {
            while (i < j && s[i] === s[j]) {
                i += 1;
                j -= 1;
            }
            return i >= j;
        };
        const check = (x: string, y: string): boolean => {
            let i = 0;
            let j = x.length - 1;
            while (i < j && x[i] === y[j]) {
                i += 1;
                j -= 1;
            }
            return isPalindrome(x, i, j) || isPalindrome(y, i, j);
        };
        return check(a, b) || check(b, a);
    }
}
