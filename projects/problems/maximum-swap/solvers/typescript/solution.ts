export class Solution {
    maximumSwap(num: number): number | string {
        const digits = [...String(num)];
        for (let i = 0; i < digits.length; i++) {
            let best = digits[i];
            let bestJ = -1;
            for (let j = digits.length - 1; j > i; j--) {
                if (digits[j] > best) {
                    best = digits[j];
                    bestJ = j;
                }
            }
            if (bestJ !== -1) {
                [digits[i], digits[bestJ]] = [digits[bestJ], digits[i]];
                const value = BigInt(digits.join(''));
                return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : value.toString();
            }
        }
        return num;
    }
}
