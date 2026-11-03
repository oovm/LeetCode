export class Solution {
    reachingPoints(sx: number, sy: number, tx: number, ty: number): boolean {
        let x = tx;
        let y = ty;
        while (x >= sx && y >= sy) {
            if (x === sx && y === sy) {
                return true;
            }
            if (x > y) {
                if (y === sy) {
                    return (x - sx) % y === 0;
                }
                x %= y;
            } else {
                if (x === sx) {
                    return (y - sy) % x === 0;
                }
                y %= x;
            }
        }
        return false;
    }
}
