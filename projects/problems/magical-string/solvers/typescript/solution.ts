export class Solution {
    magicalString(n: number): number {
        if (n === 0) {
            return 0;
        }
        const s = new Array<number>(n + 2).fill(0);
        s[0] = 1; s[1] = 2; s[2] = 2;
        let head = 2;
        let tail = 3;
        let value = 1;
        let ones = 1;
        while (tail < n) {
            for (let run = 0; run < (s[head] as number); run++) {
                s[tail] = value;
                if (value === 1 && tail < n) {
                    ones += 1;
                }
                tail += 1;
            }
            value ^= 3;
            head += 1;
        }
        return ones;
    }
}
