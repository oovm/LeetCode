export class Solution {
    lexicalOrder(n: number): number[] {
        const result: number[] = [];
        let v = 1;
        for (let i = 0; i < n; i++) {
            result.push(v);
            if (v * 10 <= n) {
                v *= 10;
            } else {
                while (v % 10 === 9 || v + 1 > n) {
                    v = Math.floor(v / 10);
                }
                v++;
            }
        }
        return result;
    }
}
