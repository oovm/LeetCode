export class Solution {
    fixedRatio(s: string, num1: number, num2: number, num3: number): number {
        const counts = new Map<number, number>([[0, 1]]);
        let zeros = 0;
        let ones = 0;
        let total = 0;
        for (const ch of s) {
            if (ch === '0') zeros += 1;
            else ones += 1;
            const key = ones * num1 - zeros * num2;
            total += counts.get(key) ?? 0;
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        return total;
    }
}
