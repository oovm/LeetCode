export class Solution {
    minEnd(n: number, x: number): number {
        let result = x;
        let fill = n - 1;
        for (let bit = 1; fill > 0; bit *= 2) {
            if (Math.floor(result / bit) % 2 === 0) {
                if (fill % 2 === 1) {
                    result += bit;
                }
                fill = Math.floor(fill / 2);
            }
        }
        return result;
    }
}
