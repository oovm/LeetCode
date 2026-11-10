export class Solution {
    judgeSquareSum(c: number): boolean {
        let b = Math.floor(Math.sqrt(c));
        while ((b + 1) * (b + 1) <= c) b++;
        while (b * b > c) b--;
        let a = 0;
        while (a <= b) {
            const sum = a * a + b * b;
            if (sum === c) return true;
            if (sum < c) a++;
            else b--;
        }
        return false;
    }
}
