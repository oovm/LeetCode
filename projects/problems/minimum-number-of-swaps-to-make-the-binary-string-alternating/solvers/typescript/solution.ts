export class Solution {
    minSwaps(s: string): number {
        const ones = [...s].filter((c) => c === '1').length;
        const zeros = s.length - ones;
        if (Math.abs(ones - zeros) > 1) {
            return -1;
        }
        const mismatch = (start: string): number => {
            let diff = 0;
            for (let i = 0; i < s.length; i++) {
                const want = i % 2 === 0 ? start : start === '0' ? '1' : '0';
                if (s[i] !== want && s[i] === '0') {
                    diff += 1;
                }
            }
            return diff;
        };
        if (ones > zeros) {
            return mismatch('1');
        }
        if (zeros > ones) {
            return mismatch('0');
        }
        return Math.min(mismatch('0'), mismatch('1'));
    }
}
