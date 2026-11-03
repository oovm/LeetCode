export class Solution {
    nextPalindrome(num: string): string {
        const n = num.length;
        const halfLen = Math.floor(n / 2);
        const half = num.slice(0, halfLen).split('');
        let i = halfLen - 2;
        while (i >= 0 && half[i] >= half[i + 1]) i -= 1;
        if (i < 0) return '';
        let j = halfLen - 1;
        while (half[j] <= half[i]) j -= 1;
        [half[i], half[j]] = [half[j], half[i]];
        const nextHalf = [...half.slice(0, i + 1), ...half.slice(i + 1).reverse()];
        const left = nextHalf.join('');
        const middle = n % 2 === 1 ? num[halfLen] : '';
        return left + middle + [...left].reverse().join('');
    }
}
