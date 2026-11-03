export class Solution {
    findEvenNumbers(digits: number[]): number[] {
        const count = new Array(10).fill(0);
        for (const d of digits) count[d]++;
        const out: number[] = [];
        for (let v = 100; v < 1000; v += 2) {
            const need = new Array(10).fill(0);
            for (const c of `${v}`) need[c.charCodeAt(0) - 48]++;
            if (need.every((n, d) => n <= count[d])) out.push(v);
        }
        return out;
    }
}
