export class Solution {
    maxNumber(n: number): number {
        let p = 1;
        while (p * 2 <= n) {
            p *= 2;
        }
        return p - 1;
    }
}
