function choose2(m: number): number {
    return m < 2 ? 0 : (m * (m - 1)) / 2;
}

export class Solution {
    distributeCandies(n: number, limit: number): number {
        const over = limit + 1;
        return choose2(n + 2) - 3 * choose2(n - over + 2) + 3 * choose2(n - 2 * over + 2) - choose2(n - 3 * over + 2);
    }
}
