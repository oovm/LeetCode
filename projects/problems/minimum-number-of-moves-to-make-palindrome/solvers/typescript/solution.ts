export class Solution {
    minMovesToMakePalindrome(s: string): number {
        const chars = s.split('');
        let moves = 0;
        let lo = 0;
        let hi = chars.length - 1;
        while (lo < hi) {
            let k = hi;
            while (k > lo && chars[k] !== chars[lo]) k -= 1;
            if (k === lo) {
                [chars[k], chars[k + 1]] = [chars[k + 1], chars[k]];
                moves += 1;
                continue;
            }
            while (k < hi) {
                [chars[k], chars[k + 1]] = [chars[k + 1], chars[k]];
                moves += 1;
                k += 1;
            }
            lo += 1;
            hi -= 1;
        }
        return moves;
    }
}
