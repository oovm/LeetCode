export class Solution {
    canMeasureWater(x: number, y: number, target: number): boolean {
        if (target > x + y) {
            return false;
        }
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        return target % gcd(x, y) === 0;
    }
}
