export class Solution {
    numberCount(a: number, b: number): number {
        let count = 0;
        for (let x = a; x <= b; x++) {
            const digits = String(x);
            if (new Set(digits).size === digits.length) {
                count += 1;
            }
        }
        return count;
    }
}
