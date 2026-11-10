export class Solution {
    fib(n: number): number {
        if (n <= 1) return n;
        let a = 0;
        let b = 1;
        for (let i = 2; i <= n; i++) {
            const c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
