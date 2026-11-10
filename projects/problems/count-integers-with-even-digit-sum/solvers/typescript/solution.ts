export class Solution {
    countEven(num: number): number {
        const digitSum = (x: number): number => {
            let s = 0;
            let v = x;
            while (v > 0) {
                s += v % 10;
                v = Math.floor(v / 10);
            }
            return s;
        };
        let count = 0;
        for (let i = 2; i <= num; i++) {
            if (digitSum(i) % 2 === 0) count++;
        }
        return count;
    }
}
