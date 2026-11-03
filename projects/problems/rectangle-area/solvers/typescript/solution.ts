export class Solution {
    computeArea(
        ax1: number, ay1: number, ax2: number, ay2: number,
        bx1: number, by1: number, bx2: number, by2: number,
    ): number {
        const areaA = (ax2 - ax1) * (ay2 - ay1);
        const areaB = (bx2 - bx1) * (by2 - by1);
        const overlapW = Math.min(ax2, bx2) - Math.max(ax1, bx1);
        const overlapH = Math.min(ay2, by2) - Math.max(ay1, by1);
        const overlap = overlapW > 0 && overlapH > 0 ? overlapW * overlapH : 0;
        return areaA + areaB - overlap;
    }
}
