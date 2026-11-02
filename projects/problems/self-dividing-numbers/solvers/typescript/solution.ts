export class Solution {
    selfDividingNumbers(left: number, right: number): number[] {
        const isSelfDividing = (n: number): boolean => {
            let num = n;
            while (num > 0) {
                const digit = num % 10;
                if (digit === 0 || n % digit !== 0) {
                    return false;
                }
                num = Math.floor(num / 10);
            }
            return true;
        };
        const result: number[] = [];
        for (let n = left; n <= right; n++) {
            if (isSelfDividing(n)) {
                result.push(n);
            }
        }
        return result;
    }
}
