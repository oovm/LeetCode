export class Solution {
    minimumBoxes(n: number): number {
        let h = 0;
        while (((h + 1) * (h + 2) * (h + 3)) / 6 <= n) {
            h += 1;
        }
        const rest = n - (h * (h + 1) * (h + 2)) / 6;
        let t = 0;
        while ((t * (t + 1)) / 2 < rest) {
            t += 1;
        }
        return (h * (h + 1)) / 2 + t;
    }
}
