export class Solution {
    cellsInRange(s: string): string[] {
        const [left, right] = s.split(":");
        const colStart = left.charCodeAt(0);
        const colEnd = right.charCodeAt(0);
        const rowStart = parseInt(left[1]);
        const rowEnd = parseInt(right[1]);
        const out: string[] = [];
        for (let c = colStart; c <= colEnd; c++) {
            for (let r = rowStart; r <= rowEnd; r++) {
                out.push(String.fromCharCode(c) + r);
            }
        }
        return out;
    }
}
