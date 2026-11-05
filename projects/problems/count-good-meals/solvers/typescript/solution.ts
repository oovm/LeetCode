export class Solution {
    countPairs(deliciousness: number[]): number {
        const counts = new Map<number, number>();
        const modulo = 1000000007;
        let total = 0;
        for (const value of deliciousness) {
            for (let power = 1; power <= 1073741824; power *= 2) {
                const wanted = power - value;
                total += counts.get(wanted) ?? 0;
            }
            total %= modulo;
            counts.set(value, (counts.get(value) ?? 0) + 1);
        }
        return total;
    }
}
