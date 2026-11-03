export class Solution {
    checkOverlap(
        radius: number, xCenter: number, yCenter: number,
        x1: number, y1: number, x2: number, y2: number,
    ): boolean {
        const cx = Math.min(Math.max(xCenter, x1), x2);
        const cy = Math.min(Math.max(yCenter, y1), y2);
        const dx = xCenter - cx;
        const dy = yCenter - cy;
        return dx * dx + dy * dy <= radius * radius;
    }
}
