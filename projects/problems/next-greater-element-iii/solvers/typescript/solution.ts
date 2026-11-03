export class Solution {
    nextGreaterElement(n: number): number {
        const digits = String(n).split('').map(Number);
        let k = digits.length - 2;
        while (k >= 0 && (digits[k] as number) >= (digits[k + 1] as number)) {
            k--;
        }
        if (k < 0) {
            return -1;
        }
        let l = digits.length - 1;
        while ((digits[l] as number) <= (digits[k] as number)) {
            l--;
        }
        [digits[k], digits[l]] = [digits[l] as number, digits[k] as number];
        const tail = digits.splice(k + 1).reverse();
        const value = Number([...digits, ...tail].join(''));
        return value > 2147483647 ? -1 : value;
    }
}
