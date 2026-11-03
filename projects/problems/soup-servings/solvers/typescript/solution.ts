export class Solution {
    soupServings(n: number): number {
        if (n >= 5000) {
            return 1;
        }
        const units = Math.ceil(n / 25);
        const memo = new Map<string, number>();
        const f = (a: number, b: number): number => {
            if (a <= 0 && b <= 0) return 0.5;
            if (a <= 0) return 1;
            if (b <= 0) return 0;
            const key = `${a},${b}`;
            const hit = memo.get(key);
            if (hit !== undefined) return hit;
            const value =
                (f(a - 4, b) + f(a - 3, b - 1) + f(a - 2, b - 2) + f(a - 1, b - 3)) / 4;
            memo.set(key, value);
            return value;
        };
        return f(units, units);
    }
}
