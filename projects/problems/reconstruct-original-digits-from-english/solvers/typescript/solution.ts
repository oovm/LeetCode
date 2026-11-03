export class Solution {
    originalDigits(s: string): string {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        const digits = new Array<number>(10).fill(0);
        digits[0] = counts[25];
        digits[2] = counts[22];
        digits[4] = counts[20];
        digits[6] = counts[23];
        digits[8] = counts[6];
        digits[3] = counts[19] - digits[8];
        digits[5] = counts[5] - digits[4];
        digits[7] = counts[18] - digits[6];
        digits[1] = counts[14] - digits[0] - digits[2] - digits[4];
        digits[9] = counts[8] - digits[5] - digits[6] - digits[8];
        return digits.map((c, d) => String(d).repeat(c)).join('');
    }
}
