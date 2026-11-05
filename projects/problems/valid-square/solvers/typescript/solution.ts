export class Solution {
    validSquare(p1: number[], p2: number[], p3: number[], p4: number[]): boolean {
        const squared = (a: number[], b: number[]): number => {
            const dx = a[0] - b[0];
            const dy = a[1] - b[1];
            return dx * dx + dy * dy;
        };
        const rightAngle = (a: number[], b: number[], c: number[]): boolean => {
            const d1 = squared(a, b);
            const d2 = squared(a, c);
            const d3 = squared(b, c);
            if (d1 === d2 && d1 + d2 === d3 && d1 !== 0) {
                return true;
            }
            if (d2 === d3 && d2 + d3 === d1 && d2 !== 0) {
                return true;
            }
            if (d1 === d3 && d1 + d3 === d2 && d1 !== 0) {
                return true;
            }
            return false;
        };
        return (
            rightAngle(p1, p2, p3) &&
            rightAngle(p2, p3, p4) &&
            rightAngle(p1, p3, p4) &&
            rightAngle(p1, p2, p4)
        );
    }
}
