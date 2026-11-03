export class Solution {
    addStrings(num1: string, num2: string): string {
        let i = num1.length - 1;
        let j = num2.length - 1;
        let carry = 0;
        const out: string[] = [];
        while (i >= 0 || j >= 0 || carry > 0) {
            const a = i >= 0 ? num1.charCodeAt(i) - 48 : 0;
            const b = j >= 0 ? num2.charCodeAt(j) - 48 : 0;
            const sum = a + b + carry;
            out.push(String(sum % 10));
            carry = Math.floor(sum / 10);
            i -= 1;
            j -= 1;
        }
        return out.reverse().join('');
    }
}
