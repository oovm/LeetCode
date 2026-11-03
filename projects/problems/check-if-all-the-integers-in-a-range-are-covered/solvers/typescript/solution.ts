export class Solution {
    isCovered(ranges: number[][], left: number, right: number): boolean {
        for (let v = left; v <= right; v++) {
            let ok = false;
            for (const [a, b] of ranges) {
                if (a <= v && v <= b) {
                    ok = true;
                    break;
                }
            }
            if (!ok) return false;
        }
        return true;
    }
}
