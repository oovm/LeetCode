export class Solution {
    longestDecomposition(text: string): number {
        let chunks = 0;
        let lo = 0;
        let hi = text.length - 1;
        let left = '';
        let right = '';
        while (lo <= hi) {
            left += text[lo];
            right = text[hi] + right;
            if (left === right) {
                chunks += lo === hi ? 1 : 2;
                left = '';
                right = '';
            }
            lo += 1;
            hi -= 1;
        }
        return chunks;
    }
}
