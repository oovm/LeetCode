export class Solution {
    addBinary(a: string, b: string): string {
        let i = a.length;
        let j = b.length;
        let carry = 0;
        let out = "";
        while (i > 0 || j > 0 || carry > 0) {
            let sum = carry;
            if (i > 0) {
                sum += a.charCodeAt(i - 1) - 48;
                i -= 1;
            }
            if (j > 0) {
                sum += b.charCodeAt(j - 1) - 48;
                j -= 1;
            }
            out += String(sum % 2);
            carry = Math.floor(sum / 2);
        }
        return out.split("").reverse().join("");
    }
}
