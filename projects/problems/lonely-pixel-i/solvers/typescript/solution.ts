export class Solution {
    findLonelyPixel(picture: string[][]): number {
        const m = picture.length;
        const n = picture[0].length;
        const rows = new Array<number>(m).fill(0);
        const cols = new Array<number>(n).fill(0);
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (picture[i][j] === "B") {
                    rows[i]++;
                    cols[j]++;
                }
            }
        }
        let count = 0;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (picture[i][j] === "B" && rows[i] === 1 && cols[j] === 1) count++;
            }
        }
        return count;
    }
}
