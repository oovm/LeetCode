export class Solution {
    convertToBase7(num: number): string {
        if (num === 0) return "0";
        const negative = num < 0;
        let value = Math.abs(num);
        let out = "";
        while (value > 0) {
            out = String(value % 7) + out;
            value = Math.floor(value / 7);
        }
        return negative ? "-" + out : out;
    }
}
