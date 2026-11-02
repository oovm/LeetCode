export class Solution {
    splitNum(num: number): number {
        const digits: number[] = [];
        while (num > 0) {
            digits.push(num % 10);
            num = Math.floor(num / 10);
        }
        digits.sort((a, b) => a - b);
        let num1 = 0;
        let num2 = 0;
        digits.forEach((d, i) => {
            if (i % 2 === 0) {
                num1 = num1 * 10 + d;
            } else {
                num2 = num2 * 10 + d;
            }
        });
        return num1 + num2;
    }
}
