export class Solution {
    longestDiverseString(a: number, b: number, c: number): string {
        const out: string[] = [];
        const pool: [number, string][] = [
            [a, 'a'],
            [b, 'b'],
            [c, 'c'],
        ];
        for (;;) {
            pool.sort((x, y) => y[0] - x[0]);
            const n = out.length;
            const idx = n >= 2 && out[n - 1] === pool[0][1] && out[n - 2] === pool[0][1] ? 1 : 0;
            if (pool[idx][0] === 0) {
                break;
            }
            out.push(pool[idx][1]);
            pool[idx][0] -= 1;
        }
        return out.join('');
    }
}
