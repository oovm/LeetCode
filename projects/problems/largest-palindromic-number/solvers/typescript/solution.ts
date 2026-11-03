export class Solution {
    largestPalindromic(num: string): string {
        const counts = new Array<number>(10).fill(0);
        for (const ch of num) {
            counts[ch.charCodeAt(0) - 48] += 1;
        }
        const left: string[] = [];
        for (let d = 9; d >= 0; d--) {
            if (d === 0 && left.length === 0) break;
            left.push(String(d).repeat(Math.floor(counts[d] / 2)));
        }
        let middle = '';
        for (let d = 9; d >= 0; d--) {
            if (counts[d] % 2 === 1) {
                middle = String(d);
                break;
            }
        }
        const leftStr = left.join('');
        if (leftStr === '' && middle === '') {
            return '0';
        }
        return leftStr + middle + [...leftStr].reverse().join('');
    }
}
