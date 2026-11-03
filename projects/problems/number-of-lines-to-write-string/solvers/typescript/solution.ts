export class Solution {
    numberOfLines(widths: number[], s: string): number[] {
        let lines = 1;
        let width = 0;
        for (const c of s) {
            const w = widths[c.charCodeAt(0) - 97];
            if (width + w > 100) {
                lines++;
                width = 0;
            }
            width += w;
        }
        return [lines, width];
    }
}
