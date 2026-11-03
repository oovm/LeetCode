export class Solution {
    stringShift(s: string, shift: number[][]): string {
        let amount = 0;
        for (const [dir, x] of shift) {
            amount += dir === 1 ? x : -x;
        }
        const n = s.length;
        amount = ((amount % n) + n) % n;
        return s.slice(n - amount) + s.slice(0, n - amount);
    }
}
