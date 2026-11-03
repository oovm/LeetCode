export class Solution {
    minInteger(num: string, k: number): string {
        const n = num.length;
        const positions: number[][] = Array.from({ length: 10 }, () => []);
        for (let i = 0; i < n; i++) {
            positions[num.charCodeAt(i) - 48].push(i);
        }
        const bit = new Array<number>(n + 1).fill(0);
        const add = (i: number): void => {
            for (let x = i + 1; x <= n; x += x & -x) bit[x] += 1;
        };
        const sum = (i: number): number => {
            let s = 0;
            for (let x = i + 1; x > 0; x -= x & -x) s += bit[x];
            return s;
        };
        const result: string[] = [];
        for (let pos = 0; pos < n; pos++) {
            for (let d = 0; d < 10; d++) {
                const idx = positions[d][0];
                if (idx === undefined) continue;
                const cost = idx - sum(idx - 1) - pos;
                if (cost <= k) {
                    k -= cost;
                    result.push(String(d));
                    positions[d].shift();
                    add(idx);
                    break;
                }
            }
        }
        return result.join('');
    }
}
