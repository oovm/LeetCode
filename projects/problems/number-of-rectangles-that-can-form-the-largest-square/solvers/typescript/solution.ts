export class Solution {
    countGoodRectangles(rectangles: number[][]): number {
        let best = 0;
        let count = 0;
        for (const [l, w] of rectangles) {
            const side = Math.min(l, w);
            if (side > best) {
                best = side;
                count = 1;
            } else if (side === best) {
                count++;
            }
        }
        return count;
    }
}
