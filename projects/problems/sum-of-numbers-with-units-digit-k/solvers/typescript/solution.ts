export class Solution {
    minimumNumbers(num: number, k: number): number {
        if (num === 0) {
            return 0;
        }
        if (k === 0) {
            return num % 10 === 0 ? 1 : -1;
        }
        for (let c = 1; c <= 10; c++) {
            if ((c * k) % 10 === num % 10 && c * k <= num) {
                return c;
            }
        }
        return -1;
    }
}
