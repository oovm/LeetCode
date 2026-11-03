const ROTATE = new Map<number, number>([[0, 0], [1, 1], [6, 9], [8, 8], [9, 6]]);

function rotated(x: number): number {
    let result = 0;
    let rest = x;
    while (rest > 0) {
        result = result * 10 + (ROTATE.get(rest % 10) as number);
        rest = Math.floor(rest / 10);
    }
    return result;
}

export class Solution {
    confusingNumberII(n: number): number {
        const digits = [0, 1, 6, 8, 9];
        const countLe = (current: number): number => {
            if (current > n) {
                return 0;
            }
            let total = current > 0 && rotated(current) !== current ? 1 : 0;
            for (const d of digits) {
                if (current === 0 && d === 0) {
                    continue;
                }
                total += countLe(current * 10 + d);
            }
            return total;
        };
        return countLe(0);
    }
}
