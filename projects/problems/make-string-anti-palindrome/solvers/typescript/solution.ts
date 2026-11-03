export class Solution {
    makeAntiPalindrome(s: string): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) counts[ch.charCodeAt(0) - 97] += 1;
        const n = s.length;
        const half = Math.floor(n / 2);
        if (counts.some((c) => c > half) && n % 2 === 0 && counts.filter((c) => c === half).length === 2) {
            return '-1';
        }
        const chars = counts.flatMap((c, i) => Array<string>(c).fill(String.fromCharCode(97 + i)));
        let j = half;
        for (let i = 0; i < half; i++) {
            if (chars[i] === chars[i + half]) {
                while (chars[j] === chars[i]) j += 1;
                [chars[j], chars[i + half]] = [chars[i + half], chars[j]];
                j += 1;
            }
        }
        for (let i = half; i < n; i++) {
            if (chars[i] === chars[n - 1 - i]) {
                let p = i + 1;
                while (chars[p] === chars[i]) p += 1;
                [chars[p], chars[i]] = [chars[i], chars[p]];
            }
        }
        return chars.join('');
    }
}
