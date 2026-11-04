export class Solution {
    maxPoints(points: number[][]): number {
        const count = points.length;
        if (count <= 2) {
            return count;
        }
        const gcd = (left: number, right: number): number => {
            let a = left;
            let b = right;
            while (b !== 0) {
                const remainder = a % b;
                a = b;
                b = remainder;
            }
            return a;
        };
        let best = 1;
        for (let origin = 0; origin < count; origin++) {
            const slopes = new Map<string, number>();
            let same = 0;
            let local = 0;
            for (let peer = 0; peer < count; peer++) {
                if (peer === origin) {
                    continue;
                }
                let dx = points[peer][0] - points[origin][0];
                let dy = points[peer][1] - points[origin][1];
                if (dx === 0 && dy === 0) {
                    same++;
                    continue;
                }
                const divisor = gcd(Math.abs(dx), Math.abs(dy));
                dx /= divisor;
                dy /= divisor;
                if (dx < 0 || (dx === 0 && dy < 0)) {
                    dx = -dx;
                    dy = -dy;
                }
                const key = `${dx},${dy}`;
                const current = (slopes.get(key) ?? 0) + 1;
                slopes.set(key, current);
                if (current > local) {
                    local = current;
                }
            }
            best = Math.max(best, local + same + 1);
        }
        return best;
    }
}
