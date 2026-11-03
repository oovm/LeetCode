export class Solution {
    minDays(n: number): number {
        const memo = new Map<number, number>([[0, 0], [1, 1]]);
        const f = (x: number): number => {
            const hit = memo.get(x);
            if (hit !== undefined) {
                return hit;
            }
            const days = 1 + Math.min((x % 2) + f(Math.floor(x / 2)), (x % 3) + f(Math.floor(x / 3)));
            memo.set(x, days);
            return days;
        };
        return f(n);
    }
}
