export class Solution {
    convertToTitle(columnNumber: number): string {
        let n = columnNumber;
        let out = "";
        while (n > 0) {
            n -= 1;
            out = String.fromCharCode((n % 26) + 65) + out;
            n = Math.floor(n / 26);
        }
        return out;
    }
}
