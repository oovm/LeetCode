export class Solution {
    minimizeSet(divisor1: number, divisor2: number, uniqueCnt1: number, uniqueCnt2: number): number {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const l = (divisor1 / gcd(divisor1, divisor2)) * divisor2;
        const feasible = (x: number): boolean =>
            x - Math.floor(x / divisor1) >= uniqueCnt1 &&
            x - Math.floor(x / divisor2) >= uniqueCnt2 &&
            x - Math.floor(x / l) >= uniqueCnt1 + uniqueCnt2;
        let low = uniqueCnt1 + uniqueCnt2;
        let high = 2 * (uniqueCnt1 + uniqueCnt2) * (divisor1 + divisor2);
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (feasible(mid)) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }
}
