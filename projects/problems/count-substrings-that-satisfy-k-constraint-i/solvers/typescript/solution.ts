export class Solution {
    countKConstraintSubstrings(s: string, k: number): number {
        let total = 0;
        let zeros = 0;
        let ones = 0;
        let left = 0;
        for (let right = 0; right < s.length; right++) {
            if (s[right] === '0') zeros += 1;
            else ones += 1;
            while (zeros > k && ones > k) {
                if (s[left] === '0') zeros -= 1;
                else ones -= 1;
                left += 1;
            }
            total += right - left + 1;
        }
        return total;
    }
}
