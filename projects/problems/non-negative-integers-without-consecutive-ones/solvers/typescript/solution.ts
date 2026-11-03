export class Solution {
    findIntegers(n: number): number {
        const fib = new Array<number>(32).fill(0);
        fib[0] = 1;
        fib[1] = 1;
        for (let i = 2; i < 32; i++) {
            fib[i] = (fib[i - 1] as number) + (fib[i - 2] as number);
        }
        let total = 0;
        let prev = 0;
        for (let i = 31; i >= 0; i--) {
            if ((n >> i) & 1) {
                total += fib[i] as number;
                if (prev) {
                    return total;
                }
                prev = 1;
            } else {
                prev = 0;
            }
        }
        return total + 1;
    }
}
