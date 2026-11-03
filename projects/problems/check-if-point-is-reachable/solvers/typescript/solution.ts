export class Solution {
    isReachable(targetX: number, targetY: number): boolean {
        let a = targetX;
        let b = targetY;
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return (a & (a - 1)) === 0;
    }
}
