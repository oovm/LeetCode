export class Solution {
    minimizeXor(num1: number, num2: number): number {
        const bitCount = (x: number): number => {
            let count = 0;
            while (x > 0) {
                count += x % 2;
                x = Math.floor(x / 2);
            }
            return count;
        };
        let cnt = bitCount(num2);
        let x = 0;
        for (let i = 30; i >= 0 && cnt > 0; i--) {
            if ((num1 >> i) & 1) {
                x |= 1 << i;
                cnt--;
            }
        }
        for (let i = 0; i < 30 && cnt > 0; i++) {
            if (!((num1 >> i) & 1)) {
                x |= 1 << i;
                cnt--;
            }
        }
        return x;
    }
}
