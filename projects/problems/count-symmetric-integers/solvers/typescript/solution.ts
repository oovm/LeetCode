export class Solution {
    countSymmetricIntegers(low: number, high: number): number {
        let count = 0;
        for (let x = low; x <= high; x++) {
            const digits = String(x);
            if (digits.length % 2 === 1) {
                continue;
            }
            const half = digits.length / 2;
            let left = 0;
            let right = 0;
            for (let i = 0; i < half; i++) {
                left += Number(digits[i]);
                right += Number(digits[i + half]);
            }
            if (left === right) {
                count += 1;
            }
        }
        return count;
    }
}
